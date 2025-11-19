const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

function convertLessThanThousand(n: number): string {
  if (n === 0) return '';

  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const one = n % 10;
    return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
  }

  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  return ones[hundred] + ' Hundred' + (rest > 0 ? ' ' + convertLessThanThousand(rest) : '');
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';

  const rupees = Math.floor(num);
  const paisa = Math.round((num - rupees) * 100);

  if (rupees === 0 && paisa === 0) return 'Zero Rupees Only';

  let result = '';

  if (rupees > 0) {
    if (rupees >= 10000000) {
      const crores = Math.floor(rupees / 10000000);
      result += convertLessThanThousand(crores) + ' Crore ';
      const remaining = rupees % 10000000;
      if (remaining > 0) {
        if (remaining >= 100000) {
          const lakhs = Math.floor(remaining / 100000);
          result += convertLessThanThousand(lakhs) + ' Lakh ';
          const rest = remaining % 100000;
          if (rest > 0) {
            if (rest >= 1000) {
              const thousands = Math.floor(rest / 1000);
              result += convertLessThanThousand(thousands) + ' Thousand ';
              const lastRest = rest % 1000;
              if (lastRest > 0) result += convertLessThanThousand(lastRest) + ' ';
            } else {
              result += convertLessThanThousand(rest) + ' ';
            }
          }
        } else if (remaining >= 1000) {
          const thousands = Math.floor(remaining / 1000);
          result += convertLessThanThousand(thousands) + ' Thousand ';
          const rest = remaining % 1000;
          if (rest > 0) result += convertLessThanThousand(rest) + ' ';
        } else {
          result += convertLessThanThousand(remaining) + ' ';
        }
      }
    } else if (rupees >= 100000) {
      const lakhs = Math.floor(rupees / 100000);
      result += convertLessThanThousand(lakhs) + ' Lakh ';
      const remaining = rupees % 100000;
      if (remaining > 0) {
        if (remaining >= 1000) {
          const thousands = Math.floor(remaining / 1000);
          result += convertLessThanThousand(thousands) + ' Thousand ';
          const rest = remaining % 1000;
          if (rest > 0) result += convertLessThanThousand(rest) + ' ';
        } else {
          result += convertLessThanThousand(remaining) + ' ';
        }
      }
    } else if (rupees >= 1000) {
      const thousands = Math.floor(rupees / 1000);
      result += convertLessThanThousand(thousands) + ' Thousand ';
      const rest = rupees % 1000;
      if (rest > 0) result += convertLessThanThousand(rest) + ' ';
    } else {
      result += convertLessThanThousand(rupees) + ' ';
    }

    result += 'Rupees';
  }

  if (paisa > 0) {
    if (rupees > 0) result += ' and ';
    result += convertLessThanThousand(paisa) + ' Paisa';
  }

  result += ' Only';
  return result.trim();
}
