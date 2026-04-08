import { NextRequest, NextResponse } from 'next/server';

// POST /api/contact — Public (Receive contact form messages)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Basic validation: Name, email, and message are mandatory
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' }, 
        { status: 400 }
      );
    }

    // MVP Approach: Simply logging to the console for now
    console.log("====================================");
    console.log("📨 NEW CONTACT MESSAGE RECEIVED!");
    console.log(`Name:    ${name}`);
    console.log(`Email:   ${email}`);
    console.log(`Phone:   ${phone || 'N/A'}`);
    console.log(`Message: ${message}`);
    console.log("====================================");

    /* Future update: If you create a ContactMessage model in Prisma later, 
       simply uncomment the lines below to save the data to the database!
      
       await prisma.contactMessage.create({
         data: { name, email, phone, message }
       });
    */

    return NextResponse.json(
      { success: true, message: 'Message received successfully!' }, 
      { status: 201 }
    );

  } catch (error) {
    console.error(" POST /api/contact Error:", error);
    return NextResponse.json(
      { error: 'Failed to submit message' }, 
      { status: 500 }
    );
  }
}