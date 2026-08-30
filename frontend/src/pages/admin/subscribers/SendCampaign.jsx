import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { getAdminSubscribers, deleteSubscriber, fetchProducts, fetchFooter } from '../../../services/api';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TEMPLATES = [
  {
    id: 'dehydrated_products',
    name: 'Template 1: Premium Dehydrated Food Ingredients (Red/White Onion & Garlic)',
    subject: 'BiteExport - Premium Dehydrated Food Ingredients Catalogue',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BiteExport - Premium Dehydrated Food Ingredients</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="background-color:#f4f6f8; margin:0 auto; width:100%; min-width:100%;">
        <tr>
            <td align="center" style="padding:20px 0;">
                <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0" align="center" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); width:600px; max-width:600px;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 25px 35px; border-bottom: 1px solid #eeeeee;">
                            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="50%" align="left" valign="middle">
                                        <a href="https://biteexport.com" target="_blank">
                                            <img src="https://biteexport.com/storage/branding/370d8eb2-5d71-46bb-a509-309ee27ebec0.png" alt="BiteExport" width="160" style="display: block; max-width: 100%;" />
                                        </a>
                                    </td>
                                    <td width="50%" align="right" valign="middle" style="font-size: 13px; color: #777777; line-height: 1.5;">
                                        <a href="mailto:info@biteexport.com" style="color: #777777; text-decoration: none;">info@biteexport.com</a><br>
                                        <a href="https://biteexport.com" style="color: #777777; text-decoration: none;">www.biteexport.com</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Hero Banner -->
                    <tr>
                        <td align="center">
                            <a href="https://biteexport.com" target="_blank">
                                <img src="https://biteexport.com/frame.png" alt="Premium Export Quality" width="600" style="display: block; width: 100%; max-width: 600px; border-bottom: 4px solid #2E7D32;" />
                            </a>
                        </td>
                    </tr>

                    <!-- Intro -->
                    <tr>
                        <td style="padding: 40px 35px;">
                            <h1 style="margin: 0 0 15px 0; font-size: 24px; color: #222222; font-weight: bold; line-height: 1.3;">Premium Dehydrated Food Ingredients</h1>
                            <p style="margin: 0 0 25px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                                BiteExport supplies quality dehydrated onion and garlic worldwide, with a focus on consistent quality, natural flavor, and reliable delivery.
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" bgcolor="#2E7D32" style="border-radius: 4px;">
                                        <a href="https://biteexport.com" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px;">REQUEST A QUOTE</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Core Products -->
                    <tr>
                        <td style="padding: 35px; background-color: #f9fafb; border-top: 1px solid #eeeeee;">
                            <h2 style="margin: 0 0 25px 0; font-size: 20px; color: #222222; text-align: center;">Our Core Products</h2>
                            <!--CORE_PRODUCTS_START-->
                            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <!-- Red Onion -->
                                    <td width="32%" valign="top" style="padding: 0 5px;">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #eaeaea; border-radius:6px; overflow:hidden;">
                                            <tr>
                                                <td><img src="https://biteexport.com/storage/products/6a6aef680059f.webp" alt="Dehydrated Red Onion" width="100%" style="display:block; width:100%; height:130px; object-fit:cover;" /></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:15px 8px; font-size:14px; color:#444444; font-weight:bold; text-align:center;">Dehydrated Red Onion</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="2%">&nbsp;</td>
                                    <!-- White Onion -->
                                    <td width="32%" valign="top" style="padding: 0 5px;">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #eaeaea; border-radius:6px; overflow:hidden;">
                                            <tr>
                                                <td><img src="https://biteexport.com/storage/products/gallery/6a6c4121edf83.webp" alt="Dehydrated White Onion" width="100%" style="display:block; width:100%; height:130px; object-fit:cover;" /></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:15px 8px; font-size:14px; color:#444444; font-weight:bold; text-align:center;">Dehydrated White Onion</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="2%">&nbsp;</td>
                                    <!-- Garlic -->
                                    <td width="32%" valign="top" style="padding: 0 5px;">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #eaeaea; border-radius:6px; overflow:hidden;">
                                            <tr>
                                                <td><img src="https://biteexport.com/storage/products/6a7481e7075ae.webp" alt="Dehydrated Garlic" width="100%" style="display:block; width:100%; height:130px; object-fit:cover;" /></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:15px 8px; font-size:14px; color:#444444; font-weight:bold; text-align:center;">Dehydrated Garlic</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <!--CORE_PRODUCTS_END-->
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 22px 25px; background-color: #1b5e20; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-size: 16px; color: #ffffff; font-weight: bold;">BiteExport</p>
                            <p style="margin: 0 0 12px 0; font-size: 11px; color: #c8e6c9; line-height: 1.4;">Global Supplier of Agricultural Products & Food Ingredients</p>
                            <p id="footer-address" style="margin: 0 0 8px 0; font-size: 12px; color: #ffffff; line-height: 1.5;">480, AR Mall, Mota Varachha, Surat, Gujarat, India</p>
                            <p style="margin: 0 0 10px 0; font-size: 12px; line-height: 1.5;">
                                <a id="footer-email" href="mailto:info@biteexport.com" style="color: #ffffff; text-decoration: none;">info@biteexport.com</a> &nbsp;|&nbsp;
                                <a href="https://biteexport.com" target="_blank" style="color: #ffffff; text-decoration: none;">biteexport.com</a>
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #81c784;">&copy; 2026 BiteExport. All Rights Reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
  },
  {
    id: 'corporate_announcement',
    name: 'Template 2: Corporate Announcement',
    subject: 'Important Announcement from BiteExport',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Announcement</title></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
    <h2 style="color: #0B63CE; margin-top: 0;">Announcement</h2>
    <p style="color: #555; line-height: 1.6;">Dear Valued Partner,</p>
    <p style="color: #555; line-height: 1.6;">We are pleased to announce new additions to our dehydrated product catalog and export infrastructure.</p>
    <div style="margin: 30px 0; text-align: center;">
      <a href="https://biteexport.com/product" style="background-color: #0B63CE; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Explore Product Range</a>
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p id="footer-text" style="font-size: 12px; color: #999; text-align: center;">BiteExport | Surat, Gujarat, India | info@biteexport.com</p>
  </div>
</body>
</html>`
  }
];

export default function SendCampaignPage() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [htmlContent, setHtmlContent] = useState(TEMPLATES[0].html);
  const [bannerUrl, setBannerUrl] = useState('https://biteexport.com/frame.png');
  const [recipientType, setRecipientType] = useState('subscribers');
  const [customEmails, setCustomEmails] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [productLimitWarning, setProductLimitWarning] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'
  const [isSending, setIsSending] = useState(false);

  const updateBannerImageInHtml = (newUrl) => {
    if (!newUrl) return;
    setHtmlContent(prev => {
      return prev.replace(/<img src="[^"]*" alt="Premium Export Quality"/, `<img src="${newUrl}" alt="Premium Export Quality"`);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const subData = await getAdminSubscribers();
      setSubscribers(Array.isArray(subData) ? subData : []);
    } catch (e) {
      console.error('Error loading subscribers', e);
    }

    try {
      const prods = await fetchProducts();
      if (Array.isArray(prods)) {
        setDbProducts(prods);
        setSelectedProductIds(prods.slice(0, 3).map(p => p.id));
      }
    } catch (e) {
      console.error('Error loading products', e);
    }

    // Check if user has saved custom HTML body in localStorage
    const savedCustomHtml = localStorage.getItem('saved_email_html_body');
    if (savedCustomHtml) {
      setHtmlContent(savedCustomHtml);
    }

    // Load Footer Address & Email from DB and replace dynamically
    try {
      const fData = await fetchFooter();
      if (fData && fData.footer) {
        const address = fData.footer.office_addresses?.[0] || '480, AR Mall, Mota Varachha, Surat, Gujarat, India';
        const email = fData.footer.email_addresses?.[0] || 'info@biteexport.com';

        setHtmlContent(prev => {
          let updated = prev;
          if (address) {
            updated = updated.replace(/<p id="footer-address"[\s\S]*?<\/p>/, `<p id="footer-address" style="margin: 0 0 8px 0; font-size: 12px; color: #ffffff; line-height: 1.5;">${address}</p>`);
          }
          if (email) {
            updated = updated.replace(/<a id="footer-email"[\s\S]*?<\/a>/, `<a id="footer-email" href="mailto:${email}" style="color: #ffffff; text-decoration: none;">${email}</a>`);
          }
          return updated;
        });
      }
    } catch (e) {
      console.error('Error loading DB footer data', e);
    }
  };

  const updateHtmlWithSelectedProducts = (targetIds) => {
    const selectedProds = dbProducts.filter(p => targetIds.includes(p.id));
    if (selectedProds.length === 0) return;

    let itemsHtml = '<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
    
    const colWidth = Math.floor(96 / selectedProds.length);

    selectedProds.forEach((p, idx) => {
      const imgUrl = p.image ? (p.image.startsWith('http') ? p.image : `https://biteexport.com/storage/${p.image}`) : 'https://biteexport.com/storage/products/6a6aef680059f.webp';
      
      itemsHtml += `
        <td width="${colWidth}%" valign="top" style="padding: 0 5px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #eaeaea; border-radius:6px; overflow:hidden;">
                <tr>
                    <td><img src="${imgUrl}" alt="${p.name}" width="100%" style="display:block; width:100%; height:130px; object-fit:cover;" /></td>
                </tr>
                <tr>
                    <td style="padding:15px 8px; font-size:14px; color:#444444; font-weight:bold; text-align:center;">${p.name}</td>
                </tr>
            </table>
        </td>`;

      if (idx < selectedProds.length - 1) {
        itemsHtml += '<td width="2%">&nbsp;</td>';
      }
    });

    itemsHtml += '</tr></table>';

    setHtmlContent(prev => {
      if (prev.includes('<!--CORE_PRODUCTS_START-->') && prev.includes('<!--CORE_PRODUCTS_END-->')) {
        const regex = /<!--CORE_PRODUCTS_START-->[\s\S]*?<!--CORE_PRODUCTS_END-->/;
        return prev.replace(regex, `<!--CORE_PRODUCTS_START-->\n${itemsHtml}\n<!--CORE_PRODUCTS_END-->`);
      }
      return prev;
    });
  };

  const handleTemplateChange = (e) => {
    const tId = e.target.value;
    setSelectedTemplateId(tId);
    const tmpl = TEMPLATES.find(t => t.id === tId);
    if (tmpl) {
      setSubject(tmpl.subject);
      setHtmlContent(tmpl.html);
      if (tId === 'dehydrated_products' && selectedProductIds.length > 0) {
        setTimeout(() => updateHtmlWithSelectedProducts(selectedProductIds), 100);
      }
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!subject || !htmlContent) {
      alert('Subject and HTML content are required.');
      return;
    }

    if (recipientType === 'custom' && !customEmails) {
      alert('Please enter at least one custom email address.');
      return;
    }

    if (!window.confirm('Are you sure you want to broadcast this email campaign?')) {
      return;
    }

    setIsSending(true);

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('html_content', htmlContent);
    formData.append('recipient_type', recipientType);
    formData.append('custom_emails', customEmails || '');
    if (pdfFile) {
      formData.append('pdf_attachment', pdfFile);
    }

    try {
      const res = await fetch('/api/admin/subscribers/send-campaign', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(json.message || 'Campaign sent successfully!');
        navigate('/admin/subscribers');
      } else {
        alert(json.message || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Error sending campaign', error);
      alert('Connection error while sending campaign.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Send Email Campaign | Admin</title>
      </Helmet>

      <div className="max-w-5xl mx-auto p-6 animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/subscribers')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <ArrowBackIcon fontSize="small" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Broadcast Email Campaign</h1>
              <p className="text-sm text-gray-500">Design, customize, and broadcast HTML email campaigns to subscribers or custom buyers.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendCampaign}
            disabled={isSending}
            className={`flex items-center gap-2 px-6 py-2.5 bg-[#0B63CE] text-white rounded-lg text-sm font-semibold shadow-sm ${isSending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Broadcast...</span>
              </>
            ) : (
              <>
                <SendIcon fontSize="small" />
                <span>Send Campaign Now</span>
              </>
            )}
          </button>
        </div>

        {/* Campaign Settings Form */}
        <form onSubmit={handleSendCampaign} className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">1. Campaign Details & Audience</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Email Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={handleTemplateChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B63CE] outline-none bg-white"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B63CE] outline-none bg-white"
                  placeholder="Email Subject Line"
                />
              </div>
            </div>

            {/* Audience selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Audience</label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B63CE] outline-none bg-white"
              >
                <option value="subscribers">All Newsletter Subscribers ({subscribers.length})</option>
                <option value="inquiries">All Inquiry Customers</option>
                <option value="all">Subscribers + Inquiry Customers (Combined)</option>
                <option value="custom">Custom Email List</option>
              </select>
            </div>

            {recipientType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Recipient List (Email with Optional Name)</label>
                <p className="text-xs text-gray-500 mb-2">You can write: <code>John Doe &lt;johndoe@example.com&gt;</code> OR <code>John Doe: johndoe@example.com</code></p>
                <textarea
                  rows={3}
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs font-mono focus:border-[#0B63CE] outline-none bg-white"
                  placeholder="John Doe <johndoe@example.com>, Alex Smith <alex@example.com>"
                />
              </div>
            )}

            {/* Personalization Tag Hint */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 text-xs text-blue-800 flex flex-col gap-1.5">
              <span className="font-semibold text-sm">💡 Personalization Tags Available:</span>
              <span>Use <code className="bg-white px-1.5 py-0.5 rounded border border-blue-300 font-bold text-blue-900">{'{name}'}</code> in Subject or Body to insert recipient's name (e.g., <em>Hi John Doe</em>).</span>
              <span>Use <code className="bg-white px-1.5 py-0.5 rounded border border-blue-300 font-bold text-blue-900">{'{email}'}</code> to insert recipient's email address.</span>
            </div>

            {/* Hero Banner Image Changer */}
            {selectedTemplateId === 'dehydrated_products' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <label className="block text-sm font-medium text-gray-700">🖼️ Change Top Banner Image</label>
                <p className="text-xs text-gray-500">Upload a new banner image or paste an image URL to replace the email header banner.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => {
                      setBannerUrl(e.target.value);
                      updateBannerImageInHtml(e.target.value);
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none bg-white font-mono"
                    placeholder="https://biteexport.com/frame.png"
                  />
                  <label className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-center shrink-0">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUri = event.target.result;
                            setBannerUrl(dataUri);
                            updateBannerImageInHtml(dataUri);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* PDF Attachment Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attach Product Brochure (PDF Optional)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0] || null)}
                className="w-full text-xs text-gray-500 border border-gray-300 rounded-lg px-3 py-2 bg-white file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0B63CE] hover:file:bg-blue-100 cursor-pointer"
              />
              {pdfFile && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  Attached: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {/* Dynamic DB Products Selection for Template 1 */}
          {selectedTemplateId === 'dehydrated_products' && dbProducts.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">2. Feature Products in Email Layout</h2>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                Select up to 3 products from your Database to showcase in the email body:
              </label>

              {productLimitWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium animate-pulse flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{productLimitWarning}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dbProducts.map(prod => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  return (
                    <label
                      key={prod.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked ? 'bg-blue-50 border-[#0B63CE] font-semibold text-[#0B63CE]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          let nextIds;
                          if (e.target.checked) {
                            if (selectedProductIds.length >= 3) {
                              setProductLimitWarning('You can select a maximum of 3 featured products for this email layout.');
                              setTimeout(() => setProductLimitWarning(''), 4000);
                              return;
                            }
                            nextIds = [...selectedProductIds, prod.id];
                          } else {
                            nextIds = selectedProductIds.filter(id => id !== prod.id);
                          }
                          setProductLimitWarning('');
                          setSelectedProductIds(nextIds);
                          updateHtmlWithSelectedProducts(nextIds);
                        }}
                        className="w-4 h-4 text-[#0B63CE] rounded"
                      />
                      <span className="truncate">{prod.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Template Content Preview & Code Editor */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">3. Template Live Preview & HTML Code</h2>
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'preview' ? 'bg-white text-[#0B63CE] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  👁️ Visual Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'code' ? 'bg-white text-[#0B63CE] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  &lt;/&gt; Edit Raw HTML Code
                </button>
              </div>
            </div>

            {viewMode === 'preview' ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-xs text-gray-500 font-mono flex items-center justify-between">
                  <span>Live Email Preview (How recipient sees it)</span>
                  <span>600px Standard Email Width</span>
                </div>
                <iframe
                  title="Email Live Preview"
                  srcDoc={htmlContent.replace('{name}', 'John Doe').replace('{email}', 'johndoe@example.com')}
                  className="w-full h-[500px] border-0 bg-white"
                />
              </div>
            ) : (
              <textarea
                rows={16}
                required
                value={htmlContent}
                onChange={(e) => {
                  setHtmlContent(e.target.value);
                  localStorage.setItem('saved_email_html_body', e.target.value);
                }}
                className="w-full border border-gray-300 rounded-lg p-4 text-xs font-mono bg-gray-50 focus:border-[#0B63CE] outline-none"
              />
            )}
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/subscribers')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className={`flex items-center gap-2 px-8 py-2.5 bg-[#0B63CE] text-white rounded-lg text-sm font-semibold shadow-sm ${isSending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Broadcast...</span>
                </>
              ) : (
                <>
                  <SendIcon fontSize="small" />
                  <span>Send Campaign Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
