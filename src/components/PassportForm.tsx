import { useState } from 'react';
import { FileText } from 'lucide-react';
import { supabase, PassportApplication } from '../lib/supabase';
import { numberToWords } from '../utils/numberToWords';

interface FormData {
  case_no: string;
  application_date: string;
  call_date: string;
  name: string;
  nic_no: string;
  address: string;
  service_type: string;
  fresh_passport_fee: string;
  renewal_fee: string;
  endorsement_fee: string;
  visa_fee: string;
  citizenship_fee: string;
  other_fee: string;
}

export default function PassportForm() {
  const [formData, setFormData] = useState<FormData>({
    case_no: '',
    application_date: new Date().toISOString().split('T')[0],
    call_date: '',
    name: '',
    nic_no: '',
    address: '',
    service_type: 'fresh',
    fresh_passport_fee: '',
    renewal_fee: '',
    endorsement_fee: '',
    visa_fee: '',
    citizenship_fee: '',
    other_fee: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const calculateTotal = () => {
    const fees = [
      parseFloat(formData.fresh_passport_fee) || 0,
      parseFloat(formData.renewal_fee) || 0,
      parseFloat(formData.endorsement_fee) || 0,
      parseFloat(formData.visa_fee) || 0,
      parseFloat(formData.citizenship_fee) || 0,
      parseFloat(formData.other_fee) || 0,
    ];
    return fees.reduce((sum, fee) => sum + fee, 0);
  };

  const total = calculateTotal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const totalAmount = calculateTotal();
    const application: Omit<PassportApplication, 'id' | 'created_at'> = {
      case_no: formData.case_no,
      application_date: formData.application_date,
      call_date: formData.call_date || undefined,
      name: formData.name,
      nic_no: formData.nic_no,
      address: formData.address,
      service_type: formData.service_type,
      fresh_passport_fee: parseFloat(formData.fresh_passport_fee) || 0,
      renewal_fee: parseFloat(formData.renewal_fee) || 0,
      endorsement_fee: parseFloat(formData.endorsement_fee) || 0,
      visa_fee: parseFloat(formData.visa_fee) || 0,
      citizenship_fee: parseFloat(formData.citizenship_fee) || 0,
      other_fee: parseFloat(formData.other_fee) || 0,
      total_amount: totalAmount,
      amount_in_words: numberToWords(totalAmount),
      bank_charges: 25,
    };

    const { error } = await supabase.from('passport_applications').insert([application]);

    if (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } else {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          case_no: '',
          application_date: new Date().toISOString().split('T')[0],
          call_date: '',
          name: '',
          nic_no: '',
          address: '',
          service_type: 'fresh',
          fresh_passport_fee: '',
          renewal_fee: '',
          endorsement_fee: '',
          visa_fee: '',
          citizenship_fee: '',
          other_fee: '',
        });
      }, 3000);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <div className="flex items-center justify-center space-x-3">
              <FileText className="w-10 h-10 text-white" />
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white">National Bank of Pakistan</h1>
                <p className="text-emerald-50 text-sm mt-1">Passport & Visa Fee Payment Form</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Case No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="case_no"
                  value={formData.case_no}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter case number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Application Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="application_date"
                  value={formData.application_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Call Date
                </label>
                <input
                  type="date"
                  name="call_date"
                  value={formData.call_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  N.I.C. No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nic_no"
                  value={formData.nic_no}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="XXXXX-XXXXXXX-X"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter complete address"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="fresh">Fresh Passport</option>
                <option value="renewal">Renewal</option>
                <option value="endorsement">Endorsement</option>
                <option value="visa">Visa</option>
                <option value="citizenship">Nationalization/Citizenship</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Fee Details (Rs.)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fresh Passport Fee</label>
                  <input
                    type="number"
                    name="fresh_passport_fee"
                    value={formData.fresh_passport_fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Fee</label>
                  <input
                    type="number"
                    name="renewal_fee"
                    value={formData.renewal_fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endorsement Fee</label>
                  <input
                    type="number"
                    name="endorsement_fee"
                    value={formData.endorsement_fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visa Fee</label>
                  <input
                    type="number"
                    name="visa_fee"
                    value={formData.visa_fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Citizenship Certificate Fee</label>
                  <input
                    type="number"
                    name="citizenship_fee"
                    value={formData.citizenship_fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Fee</label>
                  <input
                    type="number"
                    name="other_fee"
                    value={formData.other_fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Bank Charges:</span>
                  <span className="text-lg font-semibold text-gray-800">Rs. 25.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-emerald-600">Rs. {total.toFixed(2)}</span>
                </div>
                {total > 0 && (
                  <p className="text-sm text-gray-600 mt-2 italic text-right">
                    {numberToWords(total)}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-sm font-semibold text-amber-800 tracking-wide">NOT REFUNDABLE</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || total === 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 px-6 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                Application submitted successfully!
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Paid into the National Bank of Pakistan in cash for credit to Passport & Visa Fee Collection Account
        </p>
      </div>
    </div>
  );
}
