import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildAppMyVideosHref,
  buildAppVideoDetailHref,
  buildVideoSignInHref,
  getVideoListErrorMessage,
  getVideoStatusKey,
  isVideoListSuccess,
  shouldPollVideos,
} from './utils'

test('isVideoListSuccess supports success contract', () => {
  assert.equal(
    isVideoListSuccess({
      success: true,
      data: { videos: [], hasNextPage: false },
    }),
    true
  )
})

test('isVideoListSuccess supports code contract', () => {
  assert.equal(
    isVideoListSuccess({
      code: 0,
      data: { videos: [], hasNextPage: false },
    }),
    true
  )
})

test('getVideoListErrorMessage prefers error then message then fallback', () => {
  assert.equal(getVideoListErrorMessage({ error: 'A', message: 'B' }), 'A')
  assert.equal(getVideoListErrorMessage({ message: 'B' }), 'B')
  assert.equal(getVideoListErrorMessage({}), 'Failed to fetch videos')
})

test('buildVideoSignInHref encodes callback url', () => {
  assert.equal(
    buildVideoSignInHref('/video?id=1&type=new'),
    '/sign-in?callbackUrl=%2Fvideo%3Fid%3D1%26type%3Dnew'
  )
})

test('buildAppVideoDetailHref encodes video id', () => {
  assert.equal(
    buildAppVideoDetailHref('abc?x=1'),
    '/app/video-generator?id=abc%3Fx%3D1'
  )
})

test('buildAppMyVideosHref omits page query for first page', () => {
  assert.equal(buildAppMyVideosHref(), '/app/my-videos')
  assert.equal(buildAppMyVideosHref(1), '/app/my-videos')
  assert.equal(buildAppMyVideosHref(3), '/app/my-videos?page=3')
})

test('getVideoStatusKey normalizes backend statuses', () => {
  assert.equal(getVideoStatusKey('completed'), 'completed')
  assert.equal(getVideoStatusKey('succeeded'), 'completed')
  assert.equal(getVideoStatusKey('processing'), 'generating')
  assert.equal(getVideoStatusKey('uploading'), 'generating')
  assert.equal(getVideoStatusKey('queued'), 'pending')
  assert.equal(getVideoStatusKey('unknown'), 'pending')
  assert.equal(getVideoStatusKey(), 'pending')
})

test('shouldPollVideos detects pending or generating items', () => {
  assert.equal(shouldPollVideos([{ status: 'completed' }]), false)
  assert.equal(shouldPollVideos([{ status: 'pending' }]), true)
  assert.equal(shouldPollVideos([{ status: 'queued' }]), true)
  assert.equal(shouldPollVideos([{ status: 'generating' }]), true)
  assert.equal(shouldPollVideos([{ status: 'processing' }]), true)
  assert.equal(shouldPollVideos([{ status: 'uploading' }]), true)
})
