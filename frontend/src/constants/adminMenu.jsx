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
    title: 'Home Page',
    icon: <HomeIcon fontSize="small" />,
    children: [
      { title: 'Hero Slider', path: '/admin/website/home/hero-slider' },
      { title: 'About Section', path: '/admin/website/home/about-section' },
      { title: 'Product Categories', path: '/admin/website/home/product-categories-section' },
      { title: 'Why Choose Us', path: '/admin/website/home/why-choose-us' },
      { title: 'Statistics Counter', path: '/admin/website/home/statistics' },
      { title: 'Featured Products', path: '/admin/website/home/featured-products' },
      { title: 'Export Countries', path: '/admin/website/home/export-countries' },
      { title: 'Certifications', path: '/admin/website/home/certifications' },
      { title: 'Testimonials', path: '/admin/website/home/testimonials' },
      { title: 'FAQ', path: '/admin/website/home/faq' },
      { title: 'Call To Action', path: '/admin/website/home/cta' },
    ],
  },
  {
    title: 'About Page',
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
    title: 'Product',
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
    title: 'Image',
    icon: <PhotoLibraryIcon fontSize="small" />,
    children: [
      { title: 'Images', path: '/admin/website/gallery/images' },
      { title: 'Videos', path: '/admin/website/gallery/videos' },
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
];
