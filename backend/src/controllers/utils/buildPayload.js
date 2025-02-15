const buildPayload = (answers, mapping) => {
  const payload = {}
  answers.forEach(({ question_id, answer }) => {
    if (mapping[question_id]) {
      payload[mapping[question_id]] = answer
    }
  })
  return payload
}

module.exports = buildPayload
