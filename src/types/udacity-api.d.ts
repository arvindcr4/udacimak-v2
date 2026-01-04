/**
 * Type definitions for Udacity GraphQL API responses
 */

// Base types
export interface UdacityImage {
  url: string;
  width?: number;
  height?: number;
}

export interface UdacityResourceFile {
  name: string;
  uri: string;
}

export interface UdacityResources {
  files: UdacityResourceFile[];
}

export interface UdacityVideo {
  youtube_id?: string;
  china_cdn_id?: string;
  topher_id?: string;
}

export interface UdacityUserState {
  node_key?: string;
  completed_at?: string;
  last_viewed_at?: string;
  unstructured?: any;
}

// Aggregated state types
export interface UdacityLessonAggregatedState {
  node_key?: string;
  completed_at?: string;
  completion_amount?: number;
  completed_count?: number;
  concept_count?: number;
  last_viewed_child_key?: string;
}

export interface UdacityModuleAggregatedState {
  completed_at?: string;
  completion_amount?: number;
  completed_count?: number;
  concept_count?: number;
  last_viewed_child_key?: string;
  lesson_aggregated_states?: UdacityLessonAggregatedState[];
}

export interface UdacityPartAggregatedState {
  completed_at?: string;
  completion_amount?: number;
  completed_count?: number;
  concept_count?: number;
  last_viewed_child_key?: string;
  module_aggregated_states?: UdacityModuleAggregatedState[];
}

export interface UdacityAggregatedState {
  node_key?: string;
  completion_amount?: number;
  completed_count?: number;
  concept_count?: number;
  last_viewed_child_key?: string;
  part_aggregated_states?: UdacityPartAggregatedState[];
  lesson_aggregated_states?: UdacityLessonAggregatedState[];
}

// Concept types
export interface UdacityConcept {
  id: string;
  key: string;
  title: string;
  semantic_type: string;
  is_public: boolean;
  user_state?: UdacityUserState;
  resources?: UdacityResources;
}

// Atom types
export interface UdacityAtomBase {
  id: string;
  key: string;
  title: string;
  semantic_type: string;
  is_public: boolean;
  instructor_notes?: string;
  user_state?: UdacityUserState;
}

export interface UdacityTextAtom extends UdacityAtomBase {
  text: string;
}

export interface UdacityImageAtom extends UdacityAtomBase {
  url: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface UdacityVideoAtom extends UdacityAtomBase {
  video: UdacityVideo;
}

export interface UdacityEmbeddedFrameAtom extends UdacityAtomBase {
  external_uri: string;
}

export interface UdacityTaskListAtom extends UdacityAtomBase {
  tasks: any[];
  positive_feedback?: string;
  video_feedback?: UdacityVideo;
  description?: string;
}

export interface UdacityReflectAtomQuestion {
  title?: string;
  semantic_type: string;
  evaluation_id?: string;
  text?: string;
}

export interface UdacityReflectAtomAnswer {
  text?: string;
  video?: UdacityVideo;
}

export interface UdacityReflectAtom extends UdacityAtomBase {
  question: UdacityReflectAtomQuestion;
  answer: UdacityReflectAtomAnswer;
}

export interface UdacityQuizAnswer {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface UdacityQuizQuestion {
  prompt?: string;
  answers: UdacityQuizAnswer[];
}

export interface UdacityRadioQuizAtom extends UdacityAtomBase {
  question: UdacityQuizQuestion;
}

export interface UdacityCheckboxQuizAtom extends UdacityAtomBase {
  question: UdacityQuizQuestion;
}

export interface UdacityMatchingQuizConcept {
  text: string;
  correct_answer: { id: string; text: string };
}

export interface UdacityMatchingQuizQuestion {
  complex_prompt?: { text: string };
  concepts_label?: string;
  answers_label?: string;
  concepts: UdacityMatchingQuizConcept[];
  answers: { id: string; text: string }[];
}

export interface UdacityMatchingQuizAtom extends UdacityAtomBase {
  question: UdacityMatchingQuizQuestion;
}

export interface UdacityRegexMatcher {
  expression: string;
}

export interface UdacityValidatedQuizQuestion {
  prompt?: string;
  matchers?: UdacityRegexMatcher[];
}

export interface UdacityValidatedQuizAtom extends UdacityAtomBase {
  question: UdacityValidatedQuizQuestion;
}

export interface UdacityQuizInstruction {
  video?: UdacityVideo;
  text?: string;
}

export interface UdacityWidgetPlacement {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface UdacityWidget {
  group?: string;
  initial_value?: any;
  label?: string;
  marker?: string;
  model?: string;
  is_text_area?: boolean;
  tabindex?: number;
  placement?: UdacityWidgetPlacement;
}

export interface UdacityImageFormQuestion {
  title?: string;
  alt_text?: string;
  background_image?: string;
  semantic_type: string;
  evaluation_id?: string;
  widgets?: UdacityWidget[];
}

export interface UdacityInitialCodeFile {
  text: string;
  name: string;
}

export interface UdacityProgrammingQuestion {
  title?: string;
  semantic_type: string;
  evaluation_id?: string;
  initial_code_files?: UdacityInitialCodeFile[];
}

export interface UdacityCodeGradedQuestion {
  title?: string;
  prompt?: string;
  semantic_type: string;
  evaluation_id?: string;
}

export interface UdacityIFrameQuestion {
  title?: string;
  semantic_type: string;
  evaluation_id?: string;
  initial_code_files?: UdacityInitialCodeFile[];
  external_iframe_uri?: string;
}

export interface UdacityTextQuestion {
  title?: string;
  semantic_type: string;
  evaluation_id?: string;
  text?: string;
}

export interface UdacityQuizQuestionUnion {
  prompt?: string;
  title?: string;
  semantic_type: string;
  evaluation_id?: string;
  text?: string;
  widgets?: UdacityWidget[];
  initial_code_files?: UdacityInitialCodeFile[];
  external_iframe_uri?: string;
  background_image?: string;
  alt_text?: string;
}

export interface UdacityQuizAnswerFull {
  text?: string;
  video?: UdacityVideo;
}

export interface UdacityQuizAtom extends UdacityAtomBase {
  instruction?: UdacityQuizInstruction;
  question: UdacityQuizQuestionUnion;
  answer: UdacityQuizAnswerFull;
}

export interface UdacityWorkspaceAtom extends UdacityAtomBase {
  workspace_id: string;
  pool_id: string;
  view_id: string;
  gpu_capable?: boolean;
  configuration?: any;
}

export type UdacityAtom =
  | UdacityTextAtom
  | UdacityImageAtom
  | UdacityVideoAtom
  | UdacityEmbeddedFrameAtom
  | UdacityTaskListAtom
  | UdacityReflectAtom
  | UdacityRadioQuizAtom
  | UdacityCheckboxQuizAtom
  | UdacityMatchingQuizAtom
  | UdacityValidatedQuizAtom
  | UdacityQuizAtom
  | UdacityWorkspaceAtom;

// Lab types
export interface UdacityLabOverview {
  title?: string;
  summary?: string;
  key_takeaways?: string[];
  video?: UdacityVideo;
}

export interface UdacityLabDetails {
  text?: string;
}

export interface UdacityLabResult {
  state?: string;
  skill_confidence_rating_after?: number;
  skill_confidence_rating_before?: number;
}

export interface UdacityLabWorkspace {
  id: string;
  key: string;
  title: string;
  semantic_type: string;
  is_public: boolean;
  workspace_id: string;
  pool_id: string;
  view_id: string;
  configuration?: any;
}

export interface UdacityLab {
  id: string;
  key: string;
  version: string;
  locale: string;
  estimated_session_duration?: number;
  duration?: number;
  is_public: boolean;
  semantic_type: string;
  title: string;
  evaluation_objective?: string;
  partners?: any[];
  overview?: UdacityLabOverview;
  details?: UdacityLabDetails;
  review_video?: UdacityVideo;
  result?: UdacityLabResult;
  workspace?: UdacityLabWorkspace;
}

// Project types
export interface UdacityProjectState {
  state?: string;
  submissions?: UdacityProjectSubmission[];
}

export interface UdacityProjectSubmission {
  created_at: string;
  url: string;
  result?: any;
  is_legacy?: boolean;
  id: string;
  status: string;
}

export interface UdacityProject {
  key: string;
  version: string;
  locale: string;
  duration?: number;
  semantic_type: string;
  title: string;
  description?: string;
  is_public: boolean;
  summary?: string;
  forum_path?: string;
  rubric_id?: string;
  terminal_project_id?: string;
  image?: UdacityImage;
  resources?: UdacityResources;
  project_state?: UdacityProjectState;
}

// Lesson types
export interface UdacityLesson {
  id: string;
  key: string;
  version: string;
  locale: string;
  semantic_type: string;
  summary?: string;
  title: string;
  duration?: number;
  is_public: boolean;
  is_project_lesson?: boolean;
  display_workspace_project_only?: boolean;
  image?: UdacityImage;
  video?: UdacityVideo;
  resources?: UdacityResources;
  user_state?: UdacityUserState;
  concepts?: UdacityConcept[];
  atoms?: UdacityAtom[];
  project?: UdacityProject;
  lab?: UdacityLab;
}

// Module types
export interface UdacityModule {
  id: string;
  key: string;
  title: string;
  semantic_type: string;
  is_public: boolean;
  version: string;
  locale: string;
  is_project_module?: boolean;
  forum_path?: string;
  lessons: UdacityLesson[];
}

// Part types
export interface UdacityPart {
  id: string;
  key: string;
  title: string;
  semantic_type: string;
  is_public: boolean;
  version: string;
  locale: string;
  summary?: string;
  part_type: string;
  image?: UdacityImage;
  resources?: UdacityResources;
  modules: UdacityModule[];
}

// Enrollment types
export interface UdacityStaticAccess {
  static_access: boolean;
  access_expiry_at?: string;
}

export interface UdacityEnrollment {
  product_variant?: string;
  variant?: string;
  static_access?: UdacityStaticAccess;
}

// Nanodegree types
export interface UdacityCohort {
  id: string;
  start_at?: string;
  due_at?: string;
  end_at?: string;
}

export interface UdacityProjectDeadline {
  due_at?: string;
}

export interface UdacityUserStateExtended {
  completed_at?: string;
  last_viewed_at?: string;
  unstructured?: any;
}

export interface UdacityNanodegreeUnits {
  id: string;
}

export interface UdacityNanodegree {
  id: string;
  key: string;
  title: string;
  semantic_type: string;
  is_public: boolean;
  cohorts?: UdacityCohort[];
  version: string;
  locale: string;
  color_scheme?: string;
  enrollment?: UdacityEnrollment;
  nd_units?: UdacityNanodegreeUnits[];
  hero_image?: UdacityImage;
  forum_path?: string;
  summary?: string;
  is_graduated?: boolean;
  is_default?: boolean;
  project_deadlines?: UdacityProjectDeadline[];
  user_state?: UdacityUserStateExtended;
  aggregated_state?: UdacityAggregatedState;
  resources?: UdacityResources;
  parts: UdacityPart[];
}

// Course types
export interface UdacityInstructor {
  image_url?: string;
  first_name?: string;
}

export interface UdacityCourse {
  id: string;
  key: string;
  version: string;
  locale: string;
  semantic_type: string;
  forum_path?: string;
  title: string;
  is_public: boolean;
  is_default?: boolean;
  user_state?: UdacityUserStateExtended;
  resources?: UdacityResources;
  instructors?: UdacityInstructor[];
  project_deadline?: UdacityProjectDeadline;
  project?: UdacityProject;
  aggregated_state?: UdacityAggregatedState;
  lessons: UdacityLesson[];
}

// GraphQL Response types
export interface UdacityGraphqlResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: any;
  }>;
}

export interface UdacityNanodegreeResponse {
  nanodegree: UdacityNanodegree;
}

export interface UdacityCourseResponse {
  course: UdacityCourse;
}

export interface UdacityLessonResponse {
  lesson: UdacityLesson;
}

// Nanodegree info for fetching
export interface UdacityNanodegreeInfo {
  key: string;
  version?: string | null;
  locale?: string | null;
}

export interface UdacityCourseInfo {
  key: string;
}

export interface UdacityLessonInfo {
  id: number;
  locale: string;
  rootKey: string;
}

// User info types
export interface UdacityUserInfo {
  key: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}
