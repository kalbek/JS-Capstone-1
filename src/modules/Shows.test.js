const Shows = require('./Shows.js');

test('getShows() function should fetch show data from API and return response', async () => {
  // Mock the fetch function and return a sample response
  const mockResponse = [
    { id: 1, name: 'Show 1' },
    { id: 2, name: 'Show 2' },
  ];
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  }));

  // Call the getShows() function and expect the response to match
  const response = await Shows.getShows();
  expect(response).toEqual(mockResponse);
});

test('setLikesOrComments(body, url) should return response data when successful', async () => {
  // Define a mock response for successful fetch request
  const mockResponse = {
    ok: true,
    status: 200,
    text: jest.fn().mockResolvedValue('Success'),
    method: 'POST',
  };

  // Mock the fetch function with the mock response
  global.fetch = jest.fn().mockResolvedValue(mockResponse);

  // Expect the response data to be returned
  expect(global.fetch).toHaveBeenCalledWith(
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/tV364kOhzeIf5RoUn6sV/likes',
    {
      method: 'POST',
      body: JSON.stringify({ item_id: 1 }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    },
  );
});

test('setLikesOrComments(body, url) should handle network errors and return null', async () => {
  // Define a mock response for failed fetch request
  const mockResponse = {
    ok: false,
    status: 500,
    json: jest.fn().mockResolvedValue('Error'),
  };

  // Mock the fetch function with the mock response
  global.fetch = jest.fn().mockResolvedValue(mockResponse);

  // Call the function with appropriate arguments
  const responseData = await Shows.setLikesOrComments(
    { item_id: 1 },
    Shows.likesURL,
  );

  // Expect the response data to be null
  expect(responseData).toBe(null);
});
