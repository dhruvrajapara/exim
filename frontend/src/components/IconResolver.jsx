import React from 'react';

// Explicitly import icons to prevent bundling all 10,000+ icons in production
import Business from '@mui/icons-material/Business';
import Storefront from '@mui/icons-material/Storefront';
import Domain from '@mui/icons-material/Domain';
import Apartment from '@mui/icons-material/Apartment';
import CorporateFare from '@mui/icons-material/CorporateFare';
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import Work from '@mui/icons-material/Work';
import WorkHistory from '@mui/icons-material/WorkHistory';
import Handshake from '@mui/icons-material/Handshake';
import Campaign from '@mui/icons-material/Campaign';
import Public from '@mui/icons-material/Public';
import Language from '@mui/icons-material/Language';
import TravelExplore from '@mui/icons-material/TravelExplore';
import Flight from '@mui/icons-material/Flight';
import FlightTakeoff from '@mui/icons-material/FlightTakeoff';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Commute from '@mui/icons-material/Commute';
import Factory from '@mui/icons-material/Factory';
import Warehouse from '@mui/icons-material/Warehouse';
import Inventory from '@mui/icons-material/Inventory';
import Inventory2 from '@mui/icons-material/Inventory2';
import WorkspacePremium from '@mui/icons-material/WorkspacePremium';
import Verified from '@mui/icons-material/Verified';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import MilitaryTech from '@mui/icons-material/MilitaryTech';
import Recommend from '@mui/icons-material/Recommend';
import ThumbUp from '@mui/icons-material/ThumbUp';
import GppGood from '@mui/icons-material/GppGood';
import Shield from '@mui/icons-material/Shield';
import SupportAgent from '@mui/icons-material/SupportAgent';
import HeadsetMic from '@mui/icons-material/HeadsetMic';
import People from '@mui/icons-material/People';
import Groups from '@mui/icons-material/Groups';
import Person from '@mui/icons-material/Person';
import Support from '@mui/icons-material/Support';
import ContactMail from '@mui/icons-material/ContactMail';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import Chat from '@mui/icons-material/Chat';
import Forum from '@mui/icons-material/Forum';
import Assignment from '@mui/icons-material/Assignment';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingFlat from '@mui/icons-material/TrendingFlat';
import Analytics from '@mui/icons-material/Analytics';
import QueryStats from '@mui/icons-material/QueryStats';
import PieChart from '@mui/icons-material/PieChart';
import BarChart from '@mui/icons-material/BarChart';
import TrackChanges from '@mui/icons-material/TrackChanges';
import AdsClick from '@mui/icons-material/AdsClick';
import Computer from '@mui/icons-material/Computer';
import Devices from '@mui/icons-material/Devices';
import Settings from '@mui/icons-material/Settings';
import Build from '@mui/icons-material/Build';
import FlashOn from '@mui/icons-material/FlashOn';
import Lightbulb from '@mui/icons-material/Lightbulb';
import Visibility from '@mui/icons-material/Visibility';
import Info from '@mui/icons-material/Info';
import CheckCircle from '@mui/icons-material/CheckCircle';
import TaskAlt from '@mui/icons-material/TaskAlt';
import Speed from '@mui/icons-material/Speed';
import Diamond from '@mui/icons-material/Diamond';

export const iconMap = {
  Business, Storefront, Domain, Apartment, CorporateFare, MeetingRoom, Work, WorkHistory, Handshake, Campaign,
  Public, Language, TravelExplore, Flight, FlightTakeoff, LocalShipping, Commute, Factory, Warehouse, Inventory, Inventory2,
  WorkspacePremium, Verified, VerifiedUser, Star, StarBorder, EmojiEvents, MilitaryTech, Recommend, ThumbUp, GppGood, Shield,
  SupportAgent, HeadsetMic, People, Groups, Person, Support, ContactMail, QuestionAnswer, Chat, Forum,
  Assignment, AssignmentTurnedIn, TrendingUp, TrendingFlat, Analytics, QueryStats, PieChart, BarChart, TrackChanges, AdsClick,
  Computer, Devices, Settings, Build, FlashOn, Lightbulb, Visibility, Info, CheckCircle, TaskAlt, Speed, Diamond
};

export const AVAILABLE_ICONS = Object.keys(iconMap);

export const getIconComponent = (iconName, props = {}) => {
  const Icon = iconMap[iconName];
  if (!Icon) {
    const FallbackIcon = iconMap['Star'];
    return <FallbackIcon {...props} />;
  }
  return <Icon {...props} />;
};
