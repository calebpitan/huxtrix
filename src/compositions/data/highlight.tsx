
export let highlights = [
    {
      id: 1,
      src: '/images/Beautiful Image from Unsplash.jpg',
      type: 'image',
      label: 'Beautiful',
    },
    {
      id: 2,
      src: '/images/Hello Aesthe Unsplash.jpg',
      type: 'image',
      label: 'Hello',
    },
    {
      id: 3,
      src: '/images/Josh Hild Unsplash.jpg',
      type: 'image',
      label: 'Josh',
    },
    {
      id: 4,
      src: '/images/Kelly Sikkema Unsplash.jpg',
      type: 'image',
      label: 'Kelly',
    },
    {
      id: 5,
      src: '/images/Danny Greenberg Unsplash.jpg',
      type: 'image',
      label: 'Danny',
    },
  ]
  
  highlights = highlights.concat(highlights.map((h) => ({ ...h, id: h.id + highlights.length })))
  highlights = highlights.concat(highlights.map((h) => ({ ...h, id: h.id + highlights.length })))
  