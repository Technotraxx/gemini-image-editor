import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, prompt, apiKey, model } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model: model || 'gemini-2.5-flash-lite' });
    
    const content = [];
    
    // Add text prompt if provided
    if (prompt && prompt.trim()) {
      content.push({ text: prompt });
    }
    
    // Only add image data if image is provided
    if (image) {
      content.push({
        inlineData: {
          data: image.split(',')[1], // Remove data:image/jpeg;base64, prefix
          mimeType: image.split(';')[0].split(':')[1], // Extract mime type
        },
      });
    }
    
    // If no content, return error
    if (content.length === 0) {
      return NextResponse.json(
        { error: 'Either text prompt or image is required' },
        { status: 400 }
      );
    }
    
    const result = await genModel.generateContentStream(content);

    // Convert the stream to text
    let text = '';
    let images: string[] = [];
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
      
      // Check if this chunk contains image data
      if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content) {
        const parts = chunk.candidates[0].content.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              // Convert base64 data to data URL
              const mimeType = part.inlineData.mimeType || 'image/png';
              const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              images.push(dataUrl);
            }
          }
        }
      }
    }

    // Also check the final result for any image parts
    const finalResult = await result.response;
    if (finalResult.candidates && finalResult.candidates[0] && finalResult.candidates[0].content) {
      const parts = finalResult.candidates[0].content.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            if (!images.includes(dataUrl)) {
              images.push(dataUrl);
            }
          }
        }
      }
    }

    return NextResponse.json({ text, images });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}