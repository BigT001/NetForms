import React from 'react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-12 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-[21cm] mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header Banner */}
        <div className="bg-primary px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
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
              <h2 className="text-xl font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using NetForms, you agree to be bound by these Terms of Service. Our AI-powered form generation service is available only to users who can form legally binding contracts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                NetForms provides AI-powered form generation services. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">3. User Obligations</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate registration information</li>
                <li>Maintain the security of your account</li>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not misuse or attempt to manipulate our AI systems</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">4. AI-Generated Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                While our AI strives to generate accurate and appropriate form content, users are responsible for reviewing and modifying AI-generated forms to ensure they meet specific requirements and use cases.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">5. Data Usage</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of your form data. By using NetForms, you grant us the right to process and analyze your data to improve our AI models and service quality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">6. Subscription and Payments</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Subscription fees are billed according to chosen plan</li>
                <li>All payments are non-refundable</li>
                <li>We reserve the right to modify pricing with notice</li>
                <li>Cancellation policies apply as specified in plan details</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                NetForms is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The NetForms platform, including its AI technology, is protected by intellectual property rights. Users may not copy, modify, or reverse engineer any aspect of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">9. Account Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate accounts that violate these terms or engage in fraudulent or abusive behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms periodically. Continued use of NetForms after changes constitutes acceptance of new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">11. Contact Information</h2>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-muted-foreground">
                  For questions about these terms, contact us at:
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Email:</span>
                    <span className="text-primary">legal@netforms.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Address:</span>
                    <span>123 Business Ave, Suite 100</span>
                  </div>
                </div>
              </div>
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
