export type User = {
  id?: number;
  username: string;
  image?: string;
};

export type EmotionDTO = {
  id?: number;
  name: string;
  icon?: string;
  score: number;
};

export type ActivityDTO = {
  id?: number;
  userId?: number;
  name: string;
  icon?: string;
};

export type MoodDTO = {
  id?: number;
  userId: number;
  date: string;
  emotionId: number;
  note: string;
  activities: number[];
};

export type Mood = MoodDTO & {
  activities: ActivityDTO[];
  emotion: EmotionDTO;
  time: string;
};

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    customDateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMATS2 = {
  display: {
    dateInput: 'MMMM YYYY',
    customDateInput: 'MM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMATS3 = {
  display: {
    dateInput: 'D MMMM YYYY  hh:mm A',
    customDateInput: 'MM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const date_db_format = 'yyyy-MM-DD HH:mm:ss';
export const date_db_short_format = 'yyyy-MM-DD';
export const date_key_format = 'DD MMMM yyyy';
export const date_display_shortdate_format = 'D MMMM';
export const date_time_format = 'HH:mm';

export const EMOTIONS = {
  1: { name: 'awful', color: 'red', display: 'Awful' },
  2: { name: 'bad', color: '#f2b226', display: 'Bad' },
  3: { name: 'meh', color: '#4894db', display: 'Meh' },
  4: { name: 'good', color: '#61be04', display: 'Good' },
  5: { name: 'rad', color: '#119674', display: 'Rad' },
};

export const ICONS = [
  'pets',
  'shopping_cart',
  'terrain',
  'videocam',
  'wifi',
  'cake',
  'school',
  'beach_access',
  'business_center',
  'cloud_upload',
  'directions_car',
  'favorite_border',
  'local_grocery_store',
  'pets',
  'restaurant_menu',
  'account_circle',
  'alarm',
  'attach_file',
  'camera',
  'cloud_download',
  'directions_bike',
  'email',
  'event',
  'flight',
  'grade',
  'headset',
  'insert_emoticon',
  'local_cafe',
  'money',
  'notifications_active',
  'directions_walk',
  'rowing',
  'fitness_center',
  'spa',
  'local_library',
  'music_note',
  'brush',
  'build',
  'computer',
  'games',
  'movie',
  'restaurant',
  'shopping_basket',
  'work',
  'flight',
  'beach_access',
  'whatshot',
  'home',
  'language',
  'local_mall',
  'palette',
  'pets',
  'pool',
  'rowing',
  'sentiment_satisfied',
  'star',
  'thumb_up',
  'toys',
  'train',
  'videogame_asset',
  'wb_sunny',
  'weekend',
  'emoji_food_beverage',
  'emoji_nature',
  'emoji_objects',
  'emoji_people',
  'emoji_symbols',
  'emoji_transportation',
  'mood',
  'sick',
  'sports_basketball',
  'sports_football',
  'sports_soccer',
  'sports_tennis',
  'accessible',
  'accessibility_new',
  'accessible_forward',
  'ac_unit',
  'agriculture',
  'airplanemode_active',
  'airplanemode_inactive',
  'all_inbox',
  'all_inclusive',
  'apartment',
  'architecture',
  'art_track',
  'batch_prediction',
  'bike_scooter',
  'book_online',
  'bookmark',
  'bubble_chart',
  'build_circle',
  'campaign',
  'car_rental',
  'category',
  'celebration',
  'cleaning_services',
  'code',
  'construction',
  'corporate_fare',
  'create',
  'dangerous',
  'delete',
  'departure_board',
  'design_services',
  'desktop_windows',
  'dinner_dining',
  'directions_transit',
  'directions_boat',
  'dry',
  'emoji_emotions',
  'emoji_events',
  'emoji_flags',
  'emoji_nature',
  'emoji_objects',
  'emoji_people',
  'emoji_symbols',
  'emoji_transportation',
  'engineering',
  'escalator_warning',
  'euro',
  'explore',
  'extension',
  'face',
  'fastfood',
  'feedback',
  'filter_list',
  'fingerprint',
  'fireplace',
  'fitness_center',
  'flight_land',
  'flip_to_front',
  'gite',
  'grass',
  'health_and_safety',
  'home_work',
  'hotel',
  'kayaking',
  'king_bed',
  'language',
  'lightbulb',
  'luggage',
  'masks',
  'medical_services',
  'miscellaneous_services',
  'moped',
  'nature_people',
  'nights_stay',
  'no_meeting_room',
  'nordic_walking',
  'pedal_bike',
  'people',
  'person',
  'person_pin',
  'pest_control',
  'pets',
  'plagiarism',
  'psychology',
  'push_pin',
  'recommend',
  'reorder',
  'room',
  'roofing',
  'school',
  'science',
  'self_improvement',
  'sensor_door',
  'shower',
  'sledding',
  'snowboarding',
  'sports_bar',
  'stairs',
  'star_rate',
  'stay_current_landscape',
  'stay_primary_portrait',
  'storefront',
  'verified',
  'voice_over_off',
  'washing_hands',
  'water_damage',
  'waterfall_chart',
  'whatshot',
  'wheelchair_pickup',
  'work_outline',
  'wysiwyg',
  'youtube_searched_for',
];
