import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-[21cm] mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header Banner */}
        <div className="bg-primary px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                NetForms
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6 space-y-8">
          {/* Document Info */}
          <div className="flex justify-between text-sm text-muted-foreground border-b pb-4">
            <span>Effective Date: {new Date().toLocaleDateString()}</span>
            <span>Document Version: 1.0</span>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 [&>section]:border-b [&>section]:pb-6">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                NetForms we committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered form generation service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (name, email, password)</li>
                <li>Form content and structure</li>
                <li>Form responses and submissions</li>
                <li>Usage data and analytics</li>
                <li>AI-generated content and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and improve our AI form generation service</li>
                <li>Personalize your experience</li>
                <li>Process form submissions</li>
                <li>Send service updates and notifications</li>
                <li>Analyze and improve our AI algorithms</li>
                <li>Ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. Your form data is stored securely and processed in compliance with data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">5. AI Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our AI form generation service processes your input to create customized forms. This data is used to improve our AI models while maintaining user privacy. No personal information is shared with third parties without consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">6. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share data with trusted service providers who assist in operating our platform, conducting business, or servicing you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">7. User Rights</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request data deletion</li>
                <li>Export your form data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">9. Contact Information</h2>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-muted-foreground">
                  For privacy-related questions or concerns, contact us at:
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Email:</span>
                    <span className="text-primary">privacy@netforms.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Address:</span>
                    <span>123 Business Ave, Suite 100</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">10. Updates to Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. The latest version will be posted on this page with the effective date.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>© {new Date().getFullYear()} NetForms</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>End of Document</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
