import { z } from 'zod';

export const imageValidationRule = z.object({
  fieldname: z.string(),
  originalname: z.union([
    z.string().toLowerCase().endsWith('.jpg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().endsWith('.jpeg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().endsWith('.png', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().endsWith('.webp', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
  ]),
  mimetype: z.union([
    z.string().toLowerCase().includes('image/jpg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().includes('image/jpeg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().includes('image/png', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().includes('image/webp', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
  ]),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number().max(5242880, { message: 'File size must be less than 5MB' }),
});

export const audioValidationRule = z.object({
  fieldname: z.string(),
  originalname: z.string().toLowerCase().endsWith('.mp3', {
    message: 'File type must be mp3',
  }),
  mimetype: z.string().toLowerCase().includes('audio/mpeg', {
    message: 'File type must be mp3',
  }),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number().max(5242880, { message: 'File size must be less than 5MB' }),
});

export const imageValidationS3Rule = z.object({
  fieldname: z.string(),
  originalname: z.union([
    z.string().toLowerCase().endsWith('.jpg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().endsWith('.jpeg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().endsWith('.png', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().endsWith('.webp', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
  ]),
  encoding: z.string(),
  bucket: z.string(),
  key: z.string(),
  acl: z.string(),
  contentType: z.string(),
  contentDisposition: z.string().nullable(),
  contentEncoding: z.string().nullable(),
  storageClass: z.string(),
  serverSideEncryption: z.string().nullable(),
  metadata: z.object({
    fieldname: z.string().nullable(),
  }),
  mimetype: z.union([
    z.string().toLowerCase().includes('image/jpg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().includes('image/jpeg', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().includes('image/png', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
    z.string().toLowerCase().includes('image/webp', {
      message: 'File type must be jpg, jpeg, png or webp',
    }),
  ]),
  location: z.string(),
  size: z.number().max(5242880, { message: 'File size must be less than 5MB' }),
  etag: z.string(),
});
