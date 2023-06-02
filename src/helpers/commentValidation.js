import * as Yup from "yup";

export const commentSchema = Yup.object().shape({
  comment: Yup.string()
    .min(3)
    .max(45)
    .matches(
      "^[.a-zA-Z0-9-! ) , ( : ? ]*$",
      "title can only contain letters, numbers and - ! . , ? : or )."
    )
    .required(),
});
