import DashboardIcon from '@mui/icons-material/Dashboard';
import LanguageIcon from '@mui/icons-material/Language';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import StarIcon from '@mui/icons-material/Star';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PublicIcon from '@mui/icons-material/Public';
import VerifiedIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BrushIcon from '@mui/icons-material/Brush';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

export const adminMenu = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    title: 'Website Management',
    icon: <LanguageIcon fontSize="small" />,
    children: [
      {
        title: 'Home',
        icon: <HomeIcon fontSize="small" />,
        children: [
          { title: 'Hero Slider', path: '/admin/website/home/hero-slider' },
          { title: 'About Section', path: '/admin/website/home/about-section' },
          { title: 'Why Choose Us', path: '/admin/website/home/why-choose-us' },
          { title: 'Statistics Counter', path: '/admin/website/home/statistics' },
          { title: 'Product Categories', path: '/admin/website/home/product-categories' },
          { title: 'Featured Products', path: '/admin/website/home/featured-products' },
          { title: 'Export Countries', path: '/admin/website/home/export-countries' },
          { title: 'Certifications', path: '/admin/website/home/certifications' },
          { title: 'Testimonials', path: '/admin/website/home/testimonials' },
          { title: 'FAQ', path: '/admin/website/home/faq' },
          { title: 'Call To Action', path: '/admin/website/home/cta' },
        ],
      },
      {
        title: 'About Us',
        icon: <InfoIcon fontSize="small" />,
        children: [
          { title: 'Company Information', path: '/admin/website/about/company-info' },
          { title: 'Our Story', path: '/admin/website/about/our-story' },
          { title: 'Mission & Vision', path: '/admin/website/about/mission-vision' },
          { title: 'Director Message', path: '/admin/website/about/director-message' },
          { title: 'Team Members', path: '/admin/website/about/team-members' },
          { title: 'Infrastructure', path: '/admin/website/about/infrastructure' },
          { title: 'Manufacturing Process', path: '/admin/website/about/manufacturing' },
          { title: 'Why Choose Us', path: '/admin/website/about/why-choose-us' },
          { title: 'Certifications', path: '/admin/website/about/certifications' },
          { title: 'Gallery', path: '/admin/website/about/gallery' },
        ],
      },
      {
        title: 'Products',
        icon: <InventoryIcon fontSize="small" />,
        children: [
          { title: 'Manage Categories', path: '/admin/website/products/categories' },
          { title: 'Manage Products', path: '/admin/website/products/manage' },
          { title: 'Inquiry List', path: '/admin/website/products/inquiries' },
        ],
      },
      {
        title: 'Blog',
        icon: <ArticleIcon fontSize="small" />,
        children: [
          { title: 'Manage Categories', path: '/admin/website/blog/categories' },
          { title: 'Manage Blogs', path: '/admin/website/blog/posts' },
        ],
      },
      {
        title: 'Gallery',
        icon: <PhotoLibraryIcon fontSize="small" />,
        children: [
          { title: 'Images', path: '/admin/website/gallery/images' },
          { title: 'Videos', path: '/admin/website/gallery/videos' },
        ],
      },
      {
        title: 'Testimonials',
        icon: <StarIcon fontSize="small" />,
        children: [
          { title: 'Customer Reviews', path: '/admin/website/testimonials/customer-reviews' },
          { title: 'Google Reviews', path: '/admin/website/testimonials/google-reviews' },
        ],
      },
      {
        title: 'FAQ',
        icon: <QuestionAnswerIcon fontSize="small" />,
        children: [
          { title: 'FAQ Categories', path: '/admin/website/faq/categories' },
          { title: 'FAQ List', path: '/admin/website/faq/list' },
        ],
      },
      {
        title: 'Export Markets',
        icon: <PublicIcon fontSize="small" />,
        children: [
          { title: 'Countries', path: '/admin/website/markets/countries' },
          { title: 'Country Details', path: '/admin/website/markets/details' },
        ],
      },
      {
        title: 'Certifications',
        icon: <VerifiedIcon fontSize="small" />,
        children: [
          { title: 'Manage Certificates', path: '/admin/website/certifications/manage' },
        ],
      },
      {
        title: 'Downloads',
        icon: <DownloadIcon fontSize="small" />,
        children: [
          { title: 'Company Profile PDF', path: '/admin/website/downloads/profile-pdf' },
          { title: 'Product Catalogue', path: '/admin/website/downloads/catalogue' },
          { title: 'Brochure', path: '/admin/website/downloads/brochure' },
        ],
      },
      {
        title: 'Contact',
        icon: <ContactMailIcon fontSize="small" />,
        children: [
          { title: 'Contact Messages', path: '/admin/website/contact/messages' },
          { title: 'Newsletter Subscribers', path: '/admin/website/contact/newsletter' },
        ],
      },
    ],
  },
  {
    title: 'SEO Management',
    icon: <TrendingUpIcon fontSize="small" />,
    children: [
      { title: 'Meta Tags', path: '/admin/seo/meta-tags' },
      { title: 'Sitemap', path: '/admin/seo/sitemap' },
      { title: 'Robots.txt', path: '/admin/seo/robots' },
      { title: 'URL Redirects', path: '/admin/seo/redirects' },
    ],
  },
  {
    title: 'Website Settings',
    icon: <SettingsIcon fontSize="small" />,
    children: [
      {
        title: 'General',
        children: [
          { title: 'Company Name', path: '/admin/settings/general/company-name' },
          { title: 'Logo', path: '/admin/settings/general/logo' },
          { title: 'Favicon', path: '/admin/settings/general/favicon' },
        ],
      },
      {
        title: 'Contact Information',
        children: [
          { title: 'Address', path: '/admin/settings/contact/address' },
          { title: 'Phone', path: '/admin/settings/contact/phone' },
          { title: 'Email', path: '/admin/settings/contact/email' },
          { title: 'WhatsApp', path: '/admin/settings/contact/whatsapp' },
        ],
      },
      {
        title: 'Social Media',
        children: [
          { title: 'Facebook', path: '/admin/settings/social/facebook' },
          { title: 'Instagram', path: '/admin/settings/social/instagram' },
          { title: 'LinkedIn', path: '/admin/settings/social/linkedin' },
          { title: 'YouTube', path: '/admin/settings/social/youtube' },
          { title: 'Twitter', path: '/admin/settings/social/twitter' },
        ],
      },
      {
        title: 'Footer',
        children: [
          { title: 'Footer Content', path: '/admin/settings/footer/content' },
          { title: 'Quick Links', path: '/admin/settings/footer/links' },
          { title: 'Copyright', path: '/admin/settings/footer/copyright' },
        ],
      },
      {
        title: 'Google',
        children: [
          { title: 'Google Analytics', path: '/admin/settings/google/analytics' },
          { title: 'Google Tag Manager', path: '/admin/settings/google/gtm' },
          { title: 'Search Console', path: '/admin/settings/google/search-console' },
        ],
      },
      {
        title: 'Appearance',
        icon: <BrushIcon fontSize="small" />,
        children: [
          { title: 'Theme Colors', path: '/admin/settings/appearance/colors' },
          { title: 'Default Banner', path: '/admin/settings/appearance/banner' },
          { title: 'Loader', path: '/admin/settings/appearance/loader' },
        ],
      },
    ],
  },
  {
    title: 'User Management',
    icon: <PeopleIcon fontSize="small" />,
    children: [
      { title: 'Admin Users', path: '/admin/users/admins' },
      { title: 'Roles', path: '/admin/users/roles' },
      { title: 'Permissions', path: '/admin/users/permissions' },
    ],
  },
  {
    title: 'Reports',
    icon: <AssessmentIcon fontSize="small" />,
    children: [
      { title: 'Website Visitors', path: '/admin/reports/visitors' },
      { title: 'Contact Inquiry Report', path: '/admin/reports/contact-inquiries' },
      { title: 'Product Inquiry Report', path: '/admin/reports/product-inquiries' },
      { title: 'Blog Performance', path: '/admin/reports/blog-performance' },
      { title: 'Newsletter Report', path: '/admin/reports/newsletter' },
    ],
  },
  {
    title: 'Activity Logs',
    icon: <ListAltIcon fontSize="small" />,
    children: [
      { title: 'Login History', path: '/admin/logs/login-history' },
      { title: 'Admin Activity', path: '/admin/logs/admin-activity' },
      { title: 'System Logs', path: '/admin/logs/system-logs' },
    ],
  },
];
