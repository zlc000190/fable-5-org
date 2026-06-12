
import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { insertFeedback } from '@/shared/models/feedback';

export async function POST(req: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth');
    }

    const { content, rating } = await req.json();
    if (!content) {
      return respErr('invalid params');
    }

    const feedback = await insertFeedback({
      userId: user.id,
      content,
      rating,
      status: 'created',
      createdAt: new Date(),
    } as any); // cast as any if id is required but generated

    return respData(feedback);
  } catch (e) {
    console.error('add feedback failed', e);
    return respErr('add feedback failed');
  }
}
