import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContractExpirationAlert(employee: any) {
  try {
    await resend.emails.send({
      from: "HR System <noreply@hrmanager.com>",
      to: "hr@company.com",
      subject: `Contract Expiration Alert - ${employee.first_name} ${employee.last_name}`,
      html: `
        <h2>Contract Expiration Alert</h2>
        <p>The contract for <strong>${employee.first_name} ${employee.last_name}</strong> will expire in 30 days.</p>
        <p><strong>Employee ID:</strong> ${employee.employee_id}</p>
        <p><strong>Position:</strong> ${employee.position}</p>
        <p><strong>Department:</strong> ${employee.department}</p>
        <p>Please take necessary action to renew or terminate the contract.</p>
      `,
    })
  } catch (error) {
    console.error("Email alert error:", error)
  }
}

export async function sendIncompleteFileAlert(employee: any) {
  try {
    await resend.emails.send({
      from: "HR System <noreply@hrmanager.com>",
      to: "hr@company.com",
      subject: `Incomplete 201 File - ${employee.first_name} ${employee.last_name}`,
      html: `
        <h2>Incomplete 201 File Alert</h2>
        <p>The 201 file for <strong>${employee.first_name} ${employee.last_name}</strong> is incomplete.</p>
        <p><strong>Employee ID:</strong> ${employee.employee_id}</p>
        <p><strong>Position:</strong> ${employee.position}</p>
        <p>Please complete the required documents.</p>
      `,
    })
  } catch (error) {
    console.error("Email alert error:", error)
  }
}

export async function sendFileUploadNotification(employee: any, fileType: string) {
  try {
    await resend.emails.send({
      from: "HR System <noreply@hrmanager.com>",
      to: employee.email,
      subject: `Document Upload Confirmation - ${fileType}`,
      html: `
        <h2>Document Upload Confirmation</h2>
        <p>Your <strong>${fileType}</strong> has been successfully uploaded to your 201 file.</p>
        <p>You can view it anytime in your employee portal.</p>
      `,
    })
  } catch (error) {
    console.error("Email notification error:", error)
  }
}
