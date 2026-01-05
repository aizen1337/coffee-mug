import { calculateFinalOrderPrice } from '@src/domain/pricing/CalculateFinalPrice';

describe('Pricing Engine', () => {
  it('applies volume discount', () => {
    const price = calculateFinalOrderPrice(
      [
        {
          productId: 'x',
          quantity: 10,
          unitPrice: 10,
          category: 'COFFEE',
        },
      ],
      {
        location: 'US',
        orderDate: new Date('2025-01-01'),
      },
    );

    // 10 * 10 = 100 - 20% = 80
    expect(price).toBe(80);
  });

  it('applies location pricing', () => {
    const price = calculateFinalOrderPrice(
      [
        {
          productId: 'x',
          quantity: 1,
          unitPrice: 100,
          category: 'MUG',
        },
      ],
      {
        location: 'EU',
        orderDate: new Date('2025-01-03'),
      },
    );

    expect(price).toBe(115);
  });

  it('chooses best discount', () => {
    const price = calculateFinalOrderPrice(
      [
        {
          productId: 'x',
          quantity: 50,
          unitPrice: 10,
          category: 'COFFEE',
        },
      ],
      {
        location: 'US',
        orderDate: new Date('2025-11-25'), // Black Friday
      },
    );

    // volume 30% beats seasonal 25%
    expect(price).toBe(350);
  });
});
