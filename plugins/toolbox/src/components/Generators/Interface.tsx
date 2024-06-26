import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from 'quicktype-core';

import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const formatOptions = [
  'TypeScript',
  'Ruby',
  'JavaScript',
  'Flow',
  'Rust',
  'Kotlin',
  'Dart',
  'Python',
  'C#',
  'Go',
  'C++',
  'Java',
  'Scala3',
  'Swift',
  'Objective-C',
  'Elm',
  'JSON Schema',
  'Pike',
  'JavaScript PropTypes',
  'Haskell',
  'PHP',
  undefined,
] as const;
type FormatOption = (typeof formatOptions)[number];

export const Interface = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [format, setFormat] = React.useState<FormatOption>('TypeScript');

  const typeSelect = (
    <Select
      label="format"
      value={format}
      onChange={val => setFormat(val.target.value as FormatOption)}
      variant="standard"
    >
      {formatOptions.map(opt => (
        <MenuItem value={opt}>{opt}</MenuItem>
      ))}
    </Select>
  );

  useEffect(() => {
    async function toInterface() {
      try {
        const { lines } = await quicktypeJSON(format, input);
        setOutput(lines.join('\n'));
      } catch (error: any) {
        setOutput(error);
      }
    }
    toInterface();
  }, [input, format]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      additionalTools={[typeSelect]}
      output={output}
    />
  );
};

export default Interface;

async function quicktypeJSON(targetLanguage: FormatOption, jsonString: string) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage!);

  await jsonInput.addSource({
    name: 'MyInterface',
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: { 'just-types': 'true' },
  });
}
