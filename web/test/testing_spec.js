describe('fizzbuzz', function(){
    describe('#process', function(){
      it('returns Fizz if number is divisible by 3', function(){
        expect(fizzbuzz.process(3)).toBe('Fizz');
        expect(fizzbuzz.process(6)).toBe('Fizz');
      });
  
      it('returns Buzz if number is divisible by 5', function(){
        expect(fizzbuzz.process(5)).toBe('Buzz');
        expect(fizzbuzz.process(10)).toBe('Buzz');
      });
  
      it('returns FizzBuzz if number is divisible by both 3 and 5', function(){
        expect(fizzbuzz.process(15)).toBe('FizzBuzz');
        expect(fizzbuzz.process(30)).toBe('FizzBuzz');
      });
  
      it('returns number itself if number is not divisible by 3 or 5', function(){
        expect(fizzbuzz.process(4)).toBe(4);
      });
    })
  });