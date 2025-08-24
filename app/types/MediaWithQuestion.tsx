export type MediaWithQuestionType = {
    'id': string,
    'name': string,
    'file_name': string,
    'reward': string,
    'url': string
    'description' : string
    'tags': string[],
    'media_type': string,
    'question': QuestionType,
}

type QuestionType = {
    'id': string,
    'question': string,
    'option_a': string,
    'option_b': string,
    'option_c': string,
    'option_d': string,
    'answer': string,
}

