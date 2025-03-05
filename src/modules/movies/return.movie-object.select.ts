import { Prisma } from '@prisma/client';
import { actorSelect } from 'modules/actors/return.actor-object.select';
import { genreSelect } from 'modules/genres/return.genre-object.select';
import { reviewSelect } from 'modules/reviews/return.review-object.select';

export const movieSelect: Prisma.MovieSelect = {
  id: true,
  createdAt: true,
  title: true,
  slug: true,
  poster: true,
  bigPoster: true,
  videoUrl: true,
  views: true,
  country: true,
  year: true,
  duration: true,
  reviews: {
    orderBy: {
      createdAt: 'desc',
    },
    select: reviewSelect,
  },
  actors: {
    select: actorSelect,
  },
  genres: {
    select: genreSelect,
  },
};
