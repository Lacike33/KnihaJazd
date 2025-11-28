export type TActionResponse = {
  code: number;
  message: string;
  msg_code: string;
  error: { isError: boolean };
  inputs?: TActionResponseInputs;
  data?: TActionResponseUserData | TActionResponseForumData | null;
};

export type TActionResponseInputs = {
  email?: string;
  username?: string;
  section?: string;
  title?: string;
  text?: string;
};

export type TActionResponseUserData = {
  userId: string;
};

export type TActionResponseForumData = {
  sectionId: string;
  topicId: string;
};
