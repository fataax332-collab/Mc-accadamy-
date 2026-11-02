export type UserRole = 'student' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  learning_goal?: string;
  country?: string;
  created_at: string;
}

export interface Instructor {
  id: string;
  user_id?: string;
  name: string;
  title: string;
  bio: string;
  bio_somali: string;
  qualification: string;
  location: string;
  avatar_url: string;
  rating: number;
  total_students: number;
}

export type CourseLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'Medical / Healthcare' | 'Goethe Exam Prep';

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'audio' | 'worksheet';
  size: string;
  download_url: string;
}

export interface VocabularyItem {
  german: string;
  somali: string;
  example_german: string;
  example_somali: string;
  audio_hint?: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  module_title: string;
  module_order: number;
  title: string;
  title_somali: string;
  order_index: number;
  video_url: string;
  duration: string;
  is_preview: boolean;
  notes_somali: string;
  notes_german: string;
  vocabulary?: VocabularyItem[];
  resources?: LessonResource[];
}

export interface Course {
  id: string;
  title: string;
  title_somali: string;
  slug: string;
  level: CourseLevel;
  language_from: string;
  language_to: string;
  short_description: string;
  short_description_somali: string;
  description: string;
  description_somali: string;
  learning_outcomes: string[];
  price: number;
  discount_price?: number;
  thumbnail_url: string;
  instructor_id: string;
  instructor?: Instructor;
  featured: boolean;
  total_hours: number;
  total_lessons: number;
  badge_label?: string;
  certificate_included: boolean;
  is_published: boolean;
  lessons?: Lesson[];
}

export type PaymentMethod = 
  | 'evc_plus' 
  | 'zaad' 
  | 'sahal' 
  | 'edahab' 
  | 'premier_wallet' 
  | 'visa_mastercard' 
  | 'stripe';

export type PaymentGateway = 'sifalo_pay' | 'stripe';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  course_id: string;
  course_title: string;
  amount: number;
  original_amount: number;
  discount_amount: number;
  coupon_code?: string;
  currency: 'USD' | 'SOS';
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_gateway: PaymentGateway;
  customer_phone: string;
  customer_email: string;
  customer_name: string;
  transaction_ref?: string;
  receipt_url?: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  order_id?: string;
  course?: Course;
  progress_percentage: number;
  completed_lessons: string[];
  completed: boolean;
  completed_at?: string;
  certificate_id?: string;
  enrolled_at: string;
  last_accessed_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
}
