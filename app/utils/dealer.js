import generate from 'nanoid/generate';

const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export default function generateId() {
  const id = generate(CHARACTERS, 10); //=> "O5drZu0mC6"
  return id;
}

export const EntryExistsError = function ClientError(error) {
  return error.code === "ConditionalCheckFailedException";
};
