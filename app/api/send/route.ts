import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import React from 'react'
// import ReactDOMServer from 'react-dom/server'
import { EmailTemplate } from '../../../components/EmailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      mrfNumber,
      engineerName,
      projectName,
      siteLocation,
      department,
      requestDate,
      materials,
      recipients, // array of emails
    } = body

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Recipients array is required and cannot be empty' },
        { status: 400 }
      )
    }

    const response = await resend.emails.send({
      from: 'Newell <mahmoud@purchase.newellmepco.com>',
      to: recipients,
      replyTo: 'purchase.newellmepco.com',
      subject: `Material Request Approved: MRF #${mrfNumber}`,
      // html: emailHtml,
      react: EmailTemplate(
        {
          mrfNumber,
          engineerName,
          projectName,
          siteLocation,
          department,
          requestDate,
          materials,
        }
      )
    })

    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
