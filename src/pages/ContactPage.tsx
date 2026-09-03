import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

type ContactPageForm = {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  buildingPortfolio: string;
};

type FieldErrors = Partial<Record<keyof ContactPageForm, string>> & {
  form?: string;
};

const initialForm: ContactPageForm = {
  name: '',
  email: '',
  company: '',
  role: '',
  message: '',
  buildingPortfolio: '',
};

/** Existing Formspree endpoint used by the project contact form */
const FORMSPREE_ENDPOINT =
  import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xlgdqngg';

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactPageForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};

    if (!formData.name.trim()) {
      next.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      next.message = 'Please tell us what you would like to discuss';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const submissionData: Record<string, string> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      if (formData.company.trim()) {
        submissionData.company = formData.company.trim();
        submissionData.organization = formData.company.trim();
      }
      if (formData.role.trim()) {
        submissionData.role = formData.role.trim();
      }
      if (formData.buildingPortfolio.trim()) {
        submissionData.buildingPortfolio = formData.buildingPortfolio.trim();
      }

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      setIsSubmitted(true);
      setFormData(initialForm);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({
        form: 'Failed to send message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="mb-10 max-w-xl text-left">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-text-dark sm:text-4xl md:text-5xl">
                Contact
              </h1>
              <p className="text-base leading-relaxed text-text-muted sm:text-lg">
                Tell us about your building, portfolio or potential pilot case.
              </p>
            </div>

            <div className="max-w-xl">
              {isSubmitted && (
                <div
                  className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-text-dark"
                  role="status"
                >
                  Message sent. We will get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-dark">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass(errors.name)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-dark">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass(errors.email)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-text-dark">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClass()}
                  />
                </div>

                <div>
                  <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-text-dark">
                    Role
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    autoComplete="organization-title"
                    value={formData.role}
                    onChange={handleChange}
                    className={inputClass()}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-dark">
                    What would you like to discuss? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClass(errors.message)} resize-y`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-500" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="buildingPortfolio"
                    className="mb-1.5 block text-sm font-medium text-text-dark"
                  >
                    Building / portfolio
                  </label>
                  <input
                    id="buildingPortfolio"
                    name="buildingPortfolio"
                    type="text"
                    value={formData.buildingPortfolio}
                    onChange={handleChange}
                    placeholder="Building address, portfolio size or brief context"
                    className={inputClass()}
                  />
                </div>

                {errors.form && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending…' : 'Send message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
