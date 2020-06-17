import { yupToFormErrors } from "formik"
import { ArtworkFormValues } from "lib/Scenes/Consignments/v2/State/artworkModel"
import * as Yup from "yup"

export const artworkValidationSchema = Yup.object().shape({
  artist: Yup.string().test("artist", "Artist must be pablo picasso", value => value === "Pablo Picasso"),
})

export function validateArtworkSchema(values: ArtworkFormValues) {
  let initialErrors = {}
  try {
    artworkValidationSchema.validateSync(values, {
      abortEarly: false,
    })
  } catch (error) {
    initialErrors = yupToFormErrors(error)
  }
  return initialErrors
}
