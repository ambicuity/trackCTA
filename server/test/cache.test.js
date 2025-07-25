const { cache, cacheKeys } = require('../src/utils/cache');

describe('Cache Utility', () => {
  beforeEach(() => {
    // Clear cache by creating a new instance
    cache.cache.flushAll();
  });

  describe('Basic Cache Operations', () => {
    test('should set and get cache values', () => {
      const key = 'test-key';
      const value = { data: 'test' };
      
      cache.set(key, value);
      const retrieved = cache.get(key);
      
      expect(retrieved).toEqual(value);
    });

    test('should return undefined for non-existent keys', () => {
      const retrieved = cache.get('non-existent-key');
      expect(retrieved).toBeUndefined();
    });

    test('should handle cache expiration', (done) => {
      const key = 'expiring-key';
      const value = 'test-value';
      
      // Create a new cache instance with short TTL for testing
      const NodeCache = require('node-cache');
      const testCache = new NodeCache({ stdTTL: 1 });
      
      testCache.set(key, value);
      
      setTimeout(() => {
        const retrieved = testCache.get(key);
        expect(retrieved).toBeUndefined();
        done();
      }, 1100);
    });

    test('should flush all cache entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
      
      cache.cache.flushAll();
      
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
    });
  });

  describe('Cache Keys Generation', () => {
    test('should generate locale cache key', () => {
      const key = cacheKeys.locale('common', 'en');
      expect(key).toBe('locale-common-en-cache');
    });

    test('should generate routes cache key', () => {
      const key = cacheKeys.routes;
      expect(key).toBe('routes-cache');
    });

    test('should generate train routes cache key', () => {
      const key = cacheKeys.trainRoutes;
      expect(key).toBe('train-routes-cache');
    });

    test('should generate pattern cache key', () => {
      const route = '1';
      const key = cacheKeys.pattern(route);
      expect(key).toBe('pattern-1-cache');
    });

    test('should generate direction cache key', () => {
      const route = '1';
      const key = cacheKeys.direction(route);
      expect(key).toBe('dir-1-cache');
    });

    test('should generate stops cache key', () => {
      const route = '1';
      const direction = 'North';
      const key = cacheKeys.stops(route, direction);
      expect(key).toBe('stops-1-North-cache');
    });

    test('should generate train stops cache key', () => {
      const route = 'red';
      const key = cacheKeys.trainStops(route);
      expect(key).toBe('train-stops-red-cache');
    });
  });

  describe('Cache Logging', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should log cache hits', () => {
      const key = 'test-key';
      cache.log_hit(key);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cache Hit: test-key')
      );
    });

    test('should log cache misses', () => {
      const key = 'test-key';
      cache.log_miss(key);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cache Miss: test-key')
      );
    });

    test('should log stats when setting cache', () => {
      const key = 'test-key';
      const value = 'test-value';
      
      cache.set(key, value);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          keys: expect.any(Number),
          hits: expect.any(Number),
          misses: expect.any(Number)
        })
      );
    });
  });
});