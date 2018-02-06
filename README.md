# bill-splitting-app
A Node.js app to split the bill with your friends

## Getting Started

### Prerequisites

- Node.js v9.5.0
- npm 5.6.0

### Installing

Install node packages

```
npm install
```

### Using

#### 1. Prepare the name file and expense transaction file
  
Make sure:
  - Names and transaction records are separated with return key ‘\n’.
  - Words in each record are seperated with white space ' '.
  - There should be no empty lines in the name and expense files.
  - Payer name position is the same in all transaction records.
  - Transaction amount starts with the currency sign.
  - If multiple amounts are found in a single expense record, only the first amount will be processed.
  - All names appear in transaction records should be included in the name file
  
  Example:
  
  name.txt
  ```
  Alice
  Bob
  Claire
  David
  ```

  expense.txt
  ```
  Claire paid $100.10 for phone bill.
  Bob paid $55.90 for petrol.
  David paid $170.80 for groceries.
  David paid $33.40 for breakfast.
  Bob  paid $85.60 for lunch.
  Claire paid $103.45 for dinner.
  Claire $30.80 for snacks.
  Bob paid $70 for house-cleaning.
  David paid $63.50 for utilities.
  ```

#### 2. Configure file processing logic in config.json

```
{
    "filePath": "./inputs/",  ---> the input file directory
    "nameIndex": "0",  ---> the index of name in transaction record
    "currency": "$",  ---> the currency symbol
    "precision": "2"  ---> result precision by digit(s) after the floating point
}
```

#### 3. Place the name file and expense transaction file in the input file directory

#### 4. Start the app

```
npm start
```

#### 5. Enter name file's name

```
? Enter name list file name: name.txt
```

#### 7. Enter expense file's name

```
? Enter expense transactions file name: expense.txt
```

The output of the app will be something like this:

```
Alice pays David $89.31
Alice pays Claire $55.96
Alice pays Bob $33.11
```
#### 8. Actually pay your friends

## Testing

Testing is done with Jest and Sinon

```
npm test
```




