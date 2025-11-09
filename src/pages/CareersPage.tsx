// src/pages/CareersPage.tsx
import React, { useState } from 'react';
import { Send, User, Clock, Briefcase, GraduationCap, Award, Phone, Download } from 'lucide-react';
import { SERVER_URL } from './config';
import { jsPDF } from "jspdf";
import DownloadTemplate from './Download';

type YesNo = 'yes' | 'no' | '';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // availability
  availability: string[];
  supportedLivingAvailability: string; // free text for supported living program
  positionInterest: string;
  available_start_date: string;

  // employment history
  employer1: string;
  position1: string;
  duration1: string;
  reason1: string;
  employer2: string;
  position2: string;
  duration2: string;
  reason2: string;

  education: string;
  certifications: string[];

  experience: string;
  skills: string;

  reference1Name: string;
  reference1Phone: string;
  reference1Relationship: string;
  reference2Name: string;
  reference2Phone: string;
  reference2Relationship: string;

  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;

  // screening booleans as yes/no fields
  is_over_18: YesNo;
  can_perform_physical_tasks: YesNo;
  can_provide_physical_assistance: YesNo;
  can_provide_hygiene_assistance: YesNo;
  has_drivers_license: YesNo;
  has_communication_skills: YesNo;
  has_reliable_transport: YesNo;

  acknowledgment: boolean;
  signature: string;
};

function CareersPage() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'WA',
    zipCode: '',

    availability: [],
    supportedLivingAvailability: '',
    positionInterest: '',
    available_start_date: '',

    employer1: '',
    position1: '',
    duration1: '',
    reason1: '',
    employer2: '',
    position2: '',
    duration2: '',
    reason2: '',

    education: '',
    certifications: [],

    experience: '',
    skills: '',

    reference1Name: '',
    reference1Phone: '',
    reference1Relationship: '',
    reference2Name: '',
    reference2Phone: '',
    reference2Relationship: '',

    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',

    is_over_18: '',
    can_perform_physical_tasks: '',
    can_provide_physical_assistance: '',
    can_provide_hygiene_assistance: '',
    has_drivers_license: '',
    has_communication_skills: '',
    has_reliable_transport: '',

    acknowledgment: false,
    signature: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleArrayField = (field: 'availability' | 'certifications', value: string, checked: boolean) => {
    setFormData(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: checked ? [...arr, value] : arr.filter((x: string) => x !== value)
      } as FormState;
    });
  };

  const setYesNo = (field: keyof Pick<FormState,
    'is_over_18' |
    'can_perform_physical_tasks' |
    'can_provide_physical_assistance' |
    'can_provide_hygiene_assistance' |
    'has_drivers_license' |
    'has_communication_skills' |
    'has_reliable_transport'>, value: YesNo) => {
    setFormData(prev => ({ ...prev, [field]: value } as FormState));
  };

  const validateRequired = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return 'Please provide your full name.';
    if (!formData.email.trim()) return 'Please provide an email address.';
    if (!formData.phone.trim()) return 'Please provide a phone number.';
    if (!formData.address.trim()) return 'Please provide an address.';
    if (!formData.city.trim() || !formData.zipCode.trim()) return 'Please provide city and ZIP.';
    if (!formData.positionInterest) return 'Please select a position of interest.';
    if (!formData.signature.trim()) return 'Please provide a digital signature.';
    // screening questions are required per model
    const requiredScreens: Array<[keyof FormState, string]> = [
      ['is_over_18', 'Are you at least 18 years of age?'],
      ['can_perform_physical_tasks', 'Are you able to bend/lift/stand for long periods?'],
      ['can_provide_physical_assistance', 'Can you provide physical assistance if needed?'],
      ['can_provide_hygiene_assistance', 'Willing to provide personal hygiene assistance?'],
      ['has_drivers_license', "Do you have a Driver's License or ability to obtain one?"],
      ['has_communication_skills', 'Do you have good verbal and written communication skills?'],
      ['has_reliable_transport', 'Do you have your own vehicle / reliable transport?']
    ];
    for (const [k, label] of requiredScreens) {
      if (!formData[k]) return `Please answer: ${label}`;
    }
    return null;
  };

  const toBool = (v: YesNo) => v === 'yes';

  const submitApplication = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const validationError = validateRequired();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city_state_zip: `${formData.city}, ${formData.state} ${formData.zipCode}`,
      days_hours_available: formData.availability,
      supported_living_availability: formData.supportedLivingAvailability || null,
      position_desired: formData.positionInterest,
      available_start_date: formData.available_start_date || null,
      employment_history: {
        employer1: {
          name: formData.employer1 || null,
          position: formData.position1 || null,
          duration: formData.duration1 || null,
          reason_for_leaving: formData.reason1 || null
        },
        employer2: {
          name: formData.employer2 || null,
          position: formData.position2 || null,
          duration: formData.duration2 || null,
          reason_for_leaving: formData.reason2 || null
        }
      },
      education_level: formData.education || null,
      certifications: formData.certifications,
      skills_experience: [
        formData.experience ? `Experience: ${formData.experience}` : null,
        formData.skills ? `Skills: ${formData.skills}` : null
      ].filter(Boolean).join('\n'),
      references: {
        reference1: {
          name: formData.reference1Name || null,
          phone: formData.reference1Phone || null,
          relationship: formData.reference1Relationship || null
        },
        reference2: {
          name: formData.reference2Name || null,
          phone: formData.reference2Phone || null,
          relationship: formData.reference2Relationship || null
        }
      },
      emergency_contact: {
        name: formData.emergencyName || null,
        phone: formData.emergencyPhone || null,
        relationship: formData.emergencyRelationship || null
      },
      signature: formData.signature || null,

      // screening booleans
      is_over_18: toBool(formData.is_over_18),
      can_perform_physical_tasks: toBool(formData.can_perform_physical_tasks),
      can_provide_physical_assistance: toBool(formData.can_provide_physical_assistance),
      can_provide_hygiene_assistance: toBool(formData.can_provide_hygiene_assistance),
      has_drivers_license: toBool(formData.has_drivers_license),
      has_communication_skills: toBool(formData.has_communication_skills),
      has_reliable_transport: toBool(formData.has_reliable_transport)
    };

    try {
      const res = await fetch(`${SERVER_URL}/api/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => null);

      if (res.ok) {
        setSuccessMessage(`Application submitted — reference ID: ${body?.application_id ?? 'N/A'}.`);
        setErrorMessage(null);
        // reset
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: 'WA',
          zipCode: '',
          availability: [],
          supportedLivingAvailability: '',
          positionInterest: '',
          available_start_date: '',
          employer1: '',
          position1: '',
          duration1: '',
          reason1: '',
          employer2: '',
          position2: '',
          duration2: '',
          reason2: '',
          education: '',
          certifications: [],
          experience: '',
          skills: '',
          reference1Name: '',
          reference1Phone: '',
          reference1Relationship: '',
          reference2Name: '',
          reference2Phone: '',
          reference2Relationship: '',
          emergencyName: '',
          emergencyPhone: '',
          emergencyRelationship: '',
          is_over_18: '',
          can_perform_physical_tasks: '',
          can_provide_physical_assistance: '',
          can_provide_hygiene_assistance: '',
          has_drivers_license: '',
          has_communication_skills: '',
          has_reliable_transport: '',
          acknowledgment: false,
          signature: ''
        });
      } else {
        const msg = body?.message || `Server error (${res.status})`;
        setErrorMessage(msg);
      }
    } catch (err) {
      console.error('submitApplication error', err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="bg-gradient-to-br from-blue-200 via-white to-yellow-200 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* New Download Button */}
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => setShowDownloadModal(true)}
            className="bg-green-500 text-white px-8 py-2 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-200 shadow-lg"
          >
            <Download className="h-5 w-5" />
            Download Application Form
          </button>
        </div>

        {/* Modal */}
        {showDownloadModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-[842px] h-full max-h-[95vh] p-6 relative overflow-auto">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        onClick={() => setShowDownloadModal(false)}
      >
                ✕
              </button>
              <DownloadTemplate />
            </div>
          </div>
        )}

        {/* ...rest of your form and page content */}
      </div>
    </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">Caring Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Make a meaningful difference in the lives of others. Apply to become a caregiver with New Daybreak Home Support.
          </p>
        </div>



        {/* Feedback */}
        {successMessage && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">{successMessage}</div>}
        {errorMessage && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{errorMessage}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Personal Info */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mr-4"><User className="h-6 w-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input type="text" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input type="text" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input type="text" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input type="text" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input type="text" required value={formData.zipCode} onChange={e => setFormData({ ...formData, zipCode: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>
            </div>
          </section>

          {/* Availability & Position */}
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mr-4"><Clock className="h-6 w-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-gray-900">Availability & Position</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Availability (check all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Mornings', 'Afternoons', 'Evenings', 'Weekends', 'Overnight', '24-Hour'].map(time => (
                    <label key={time} className="flex items-center">
                      <input type="checkbox" checked={formData.availability.includes(time)} onChange={(e) => toggleArrayField('availability', time, e.target.checked)} className="rounded border-gray-300 text-yellow-600" />
                      <span className="ml-2 text-sm text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supported Living Availability (days & times)</label>
                <input type="text" value={formData.supportedLivingAvailability} onChange={e => setFormData({ ...formData, supportedLivingAvailability: e.target.value })} placeholder="E.g., Mon-Fri 8am-6pm, Weekends unavailable" className="w-full px-4 py-3 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position Interest *</label>
                <select required value={formData.positionInterest} onChange={e => setFormData({ ...formData, positionInterest: e.target.value })} className="w-full px-4 py-3 border rounded">
                  <option value="">Select a position</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="companion">Companion</option>
                  <option value="housekeeper">Housekeeper</option>
                  <option value="overnight">Overnight Caregiver</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Start Date (optional)</label>
                <input type="date" value={formData.available_start_date} onChange={e => setFormData({ ...formData, available_start_date: e.target.value })} className="w-full px-4 py-3 border rounded" />
              </div>
            </div>
          </section>

          {/* Employment History */}
          <section className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full mr-4"><Briefcase className="h-6 w-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-gray-900">Employment History</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Recent Employer</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input placeholder="Employer Name" value={formData.employer1} onChange={e => setFormData({ ...formData, employer1: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input placeholder="Position" value={formData.position1} onChange={e => setFormData({ ...formData, position1: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input placeholder="Duration (e.g., Jan 2020 - Dec 2023)" value={formData.duration1} onChange={e => setFormData({ ...formData, duration1: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input placeholder="Reason for Leaving" value={formData.reason1} onChange={e => setFormData({ ...formData, reason1: e.target.value })} className="w-full px-4 py-3 border rounded" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Employer</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input placeholder="Employer Name" value={formData.employer2} onChange={e => setFormData({ ...formData, employer2: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input placeholder="Position" value={formData.position2} onChange={e => setFormData({ ...formData, position2: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input placeholder="Duration" value={formData.duration2} onChange={e => setFormData({ ...formData, duration2: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input placeholder="Reason for Leaving" value={formData.reason2} onChange={e => setFormData({ ...formData, reason2: e.target.value })} className="w-full px-4 py-3 border rounded" />
                </div>
              </div>
            </div>
          </section>

          {/* Education & Certifications */}
          <section className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mr-4"><GraduationCap className="h-6 w-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-gray-900">Education & Certifications</h2>
            </div>

            <div className="space-y-6">
              <select value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} className="w-full px-4 py-3 border rounded">
                <option value="">Select education level</option>
                <option value="high-school">High School Diploma/GED</option>
                <option value="some-college">Some College</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="other">Other</option>
              </select>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Certifications (check all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['CPR', 'CNA', 'HCA', 'First Aid', 'Dementia Care', 'Other'].map(cert => (
                    <label key={cert} className="flex items-center">
                      <input type="checkbox" checked={formData.certifications.includes(cert)} onChange={(e) => toggleArrayField('certifications', cert, e.target.checked)} className="rounded border-gray-300 text-yellow-600" />
                      <span className="ml-2 text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Skills & Experience */}
          <section className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full mr-4"><Award className="h-6 w-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-gray-900">Skills & Experience</h2>
            </div>

            <div className="space-y-6">
              <textarea rows={4} value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} placeholder="Describe your experience..." className="w-full px-4 py-3 border rounded" />
              <textarea rows={3} value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="Languages spoken, special training, etc..." className="w-full px-4 py-3 border rounded" />
            </div>
          </section>

          {/* Screening questions (required) */}
          <section className="bg-white p-6 rounded-2xl border">
            <h2 className="text-xl font-bold mb-4">Screening & Eligibility (required)</h2>

            {([
              { key: 'is_over_18', label: 'Are you at least 18 years of age or older?' },
              { key: 'can_perform_physical_tasks', label: 'Are you able to bend, lift up to 25 pounds, stoop, stand and/or sit for long periods?' },
              { key: 'can_provide_physical_assistance', label: 'Are you able to provide physical assistance if needed?' },
              { key: 'can_provide_hygiene_assistance', label: 'Are you willing to provide personal hygiene assistance if needed?' },
              { key: 'has_drivers_license', label: "Do you have a current Driver's License or the ability to obtain one prior to employment?" },
              { key: 'has_communication_skills', label: 'Do you have good verbal and written communication skills?' },
              { key: 'has_reliable_transport', label: 'Do you have your own vehicle or access to a vehicle you are insured to drive and reliably transport clients?' }
            ] as Array<{key: keyof FormState, label: string}>).map(item => (
              <div key={String(item.key)} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{item.label}</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name={String(item.key)} checked={formData[item.key] === 'yes'} onChange={() => setYesNo(item.key as any, 'yes')} className="form-radio" />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name={String(item.key)} checked={formData[item.key] === 'no'} onChange={() => setYesNo(item.key as any, 'no')} className="form-radio" />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
            ))}
          </section>

          {/* References */}
          <section className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full mr-4"><Phone className="h-6 w-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-gray-900">References</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reference 1</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input required placeholder="Full Name" value={formData.reference1Name} onChange={e => setFormData({ ...formData, reference1Name: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input required placeholder="Phone Number" value={formData.reference1Phone} onChange={e => setFormData({ ...formData, reference1Phone: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input required placeholder="Relationship" value={formData.reference1Relationship} onChange={e => setFormData({ ...formData, reference1Relationship: e.target.value })} className="w-full px-4 py-3 border rounded" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reference 2</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input required placeholder="Full Name" value={formData.reference2Name} onChange={e => setFormData({ ...formData, reference2Name: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input required placeholder="Phone Number" value={formData.reference2Phone} onChange={e => setFormData({ ...formData, reference2Phone: e.target.value })} className="w-full px-4 py-3 border rounded" />
                  <input required placeholder="Relationship" value={formData.reference2Relationship} onChange={e => setFormData({ ...formData, reference2Relationship: e.target.value })} className="w-full px-4 py-3 border rounded" />
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contact</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <input required placeholder="Full Name" value={formData.emergencyName} onChange={e => setFormData({ ...formData, emergencyName: e.target.value })} className="w-full px-4 py-3 border rounded" />
              <input required placeholder="Phone Number" value={formData.emergencyPhone} onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })} className="w-full px-4 py-3 border rounded" />
              <input required placeholder="Relationship" value={formData.emergencyRelationship} onChange={e => setFormData({ ...formData, emergencyRelationship: e.target.value })} className="w-full px-4 py-3 border rounded" />
            </div>
          </section>

          {/* Acknowledgment & Signature */}
          <section className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Acknowledgment & Signature</h2>
            <label className="flex items-start mb-4">
              <input type="checkbox" required checked={formData.acknowledgment} onChange={e => setFormData({ ...formData, acknowledgment: e.target.checked })} className="rounded border-gray-300 text-yellow-600 mt-1" />
              <span className="ml-3 text-sm text-gray-700">I acknowledge that all information provided is true and accurate. I authorize New Daybreak Home Support to verify the information and perform background checks as necessary.</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature *</label>
              <input required type="text" placeholder="Type your full name as your digital signature" value={formData.signature} onChange={e => setFormData({ ...formData, signature: e.target.value })} className="w-full px-4 py-3 border rounded" />
            </div>
          </section>

          {/* Submit */}
          <div className="text-center">
            <button disabled={isSubmitting} type="submit" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-12 py-4 rounded-full font-semibold shadow-lg inline-flex items-center">
              {isSubmitting ? 'Sending...' : 'Submit Application'}
              <Send className="inline-block ml-2 h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CareersPage;



