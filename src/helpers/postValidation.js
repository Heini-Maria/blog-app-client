import * as Yup from "yup";

export const postSchema = Yup.object().shape({
  title: Yup.string()
    .min(3)
    .max(60)
    .matches(
      "^[.a-zA-Z0-9-! ) : ? ]*$",
      "title can only contain letters, numbers and - ! ? : or )."
    )
    .required(),
  post: Yup.string()
    .min(10)
    .max(300)
    .matches(
      "^[.a-zA-Z0-9-! ) : ? ]*$",
      "post can only contain letters, numbers and - ! ? : or )."
    )
    .required(),
});
