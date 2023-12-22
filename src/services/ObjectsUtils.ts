/* eslint-disable @typescript-eslint/ban-ts-comment */
import { filesize } from 'filesize';
import moment, { Moment } from 'moment';

export function getChangedValues<T>(values: T, initialValues: T): Partial<T> {
  return (
    Object
      // @ts-ignore
      .entries(values)
      .reduce((acc, [key, value]) => {
        // @ts-ignore
        const hasChanged = initialValues[key] !== value;

        if (hasChanged) {
          // @ts-ignore
          acc[key] = value;
        }

        return acc;
      }, {})
  );
}
export function maskFormaterCnpj(cnpj: string) {
  if (cnpj.length <= 14) {
    //Coloca ponto entre o segundo e o terceiro dígitos
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    //Coloca ponto entre o quinto e o sexto dígitos
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    //Coloca uma barra entre o oitavo e o nono dígitos
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    //Coloca um hífen depois do bloco de quatro dígitos
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
  }
  return cnpj;
  //.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") // formata se completo
}
export function removeMaskCnpj(cnpj: string) {
  return cnpj.replace(/[^\d]/g, '');
}
export function validateCnpj(cnpj: string) {
  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999' ||
    cnpj.length !== 14
  ) {
    return false;
  }

  const tamanho = cnpj.length - 2;
  const numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  const resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != Number(digitos.charAt(0))) {
    return false;
  }
  return true;
}

export function getPeriodBetweenDates(
  type: 'year' | 'month' | 'week' | 'day',
  startDate: Moment,
  endDate?: Moment,
  maxCalculateDates?: number,
  repeat = 1,
  multiplicator = 1
): string[] {
  if (!isPostiveValid(repeat) || !isPostiveValid(multiplicator))
    throw new Error(
      `Os numeros informados como multiplicador(${multiplicator}) e repetidor(${repeat}) devem ser validos`
    );

  const references: string[] = [];
  const currentDate = moment(startDate);
  const lastDate = moment(endDate || startDate);

  while (
    currentDate.isSameOrBefore(lastDate) ||
    (!endDate && maxCalculateDates && maxCalculateDates > references.length)
  ) {
    references.push(currentDate.format().split('T')[0]);
    currentDate.add(repeat * multiplicator, type);
  }
  return references;
}
/**
 * O numero é Positivo e valido quando pertence ao conjunto dos numeros reais & Não negativo & diferente de 0
 */
function isPostiveValid(num: number) {
  return num > 0;
}

export function useFilesize(bytes: number) {
  return filesize(bytes, { base: 2, standard: 'jedec', output: 'string' });
}
