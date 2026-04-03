
import React from 'react';
import { 
    Sparkles, Fingerprint, Anchor, Brain, Castle, HeartHandshake, Scroll, Scale, 
    Flame, BookOpen, Wheat, Compass, Feather, Target, Users, User, Briefcase, 
    ThumbsUp, ThumbsDown, AlertTriangle, Sprout, Map, Church, ArrowRight, 
    ExternalLink, ArrowUpRight, ChevronRight, X, Dna, Activity, Zap, Crown, Check,
    Save, Trash2, History, Dumbbell, GraduationCap, ListChecks, Lightbulb, UserCheck,
    Network, Link, ZoomIn, CheckCircle, XCircle, UserPlus, Copy, MessageCircle, Gavel, Flag,
    Eye, TrendingUp, Shield, Download,
    type LucideProps
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
    Sparkles, Fingerprint, Anchor, Brain, Castle, HeartHandshake, Scroll, Scale,
    Flame, BookOpen, Wheat, Compass, Feather, Target, Users, User, Briefcase,
    ThumbsUp, ThumbsDown, AlertTriangle, Sprout, Map, Church, ArrowRight,
    ExternalLink, ArrowUpRight, ChevronRight, X, Dna, Activity, Zap, Crown, Check,
    Save, Trash2, History, Dumbbell, GraduationCap, ListChecks, Lightbulb, UserCheck,
    Network, Link, ZoomIn, CheckCircle, XCircle, UserPlus, Copy, MessageCircle, Gavel, Flag,
    Eye, TrendingUp, Shield
};

export interface IconProps {
    name: string;
    size?: number | string;
    className?: string;
    [key: string]: any;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = "", ...props }) => {
    const LucideIcon = iconMap[name];

    if (!LucideIcon) {
        return <span className={`inline-block bg-gray-200 rounded-full ${className}`} style={{ width: size, height: size }}></span>;
    }

    return <LucideIcon size={size} className={className} {...(props as LucideProps)} />;
};
