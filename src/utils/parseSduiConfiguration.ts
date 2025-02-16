import moment from 'moment';

// Define a type for the parser configuration
type ParserConfig = {
  [key: string]: (value: any) => any;
};

// Default parsers for known fields
const defaultParsers: ParserConfig = {
  value: (value: any) => {
    if (typeof value === 'object' && value.time && value.unit) {
      return moment().subtract(value.time, value.unit).toISOString();
    }
    return value;
  }
  // Add more default parsers here
};

// Recursive parsing function
export const parseSduiConfiguration = <T = any>(
  data: T,
  customParsers: ParserConfig = {}
): T => {
  // Merge default parsers with custom parsers
  const parsers = { ...defaultParsers, ...customParsers };

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => parseSduiConfiguration(item, customParsers)) as T;
  }

  // Handle objects
  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // Apply parser if it exists
        if (parsers[key]) {
          result[key] = parsers[key](data[key]);
        } else {
          // Recursively parse nested objects
          result[key] = parseSduiConfiguration(data[key], customParsers);
        }
      }
    }
    return result as T;
  }

  // Return primitive values as-is
  return data;
}; 