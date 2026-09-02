import type { CheerioAPI } from 'cheerio'

/**
 * Returns the visible label text for every radio input with the given
 * `name`, in document order. Used to assert which choices a question
 * offers without depending on their underlying values.
 */
export const getRadioOptionLabels = ($: CheerioAPI, name: string): string[] =>
  $(`input[name="${name}"]`)
    .map((_, input) =>
      $(`label[for="${$(input).attr('id')}"]`)
        .text()
        .trim(),
    )
    .get()

/**
 * Returns the visible label text of whichever radio input with the given
 * `name` is currently checked. Used to assert a previously saved answer is
 * redisplayed correctly.
 */
export const getSelectedRadioLabel = ($: CheerioAPI, name: string): string => {
  const selected = $(`input[name="${name}"]:checked`)

  return $(`label[for="${selected.attr('id')}"]`)
    .text()
    .trim()
}
