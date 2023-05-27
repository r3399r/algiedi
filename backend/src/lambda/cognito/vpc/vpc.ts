import { bindings } from 'src/bindings';
import { VpcService } from 'src/logic/VpcService';
import { FromOutsideEvent, LambdaContext } from 'src/model/Lambda';

export async function vpc(
  event: FromOutsideEvent,
  _context?: LambdaContext
): Promise<void> {
  const service = bindings.get(VpcService);

  if (event.source === 'init-user') await service.initUser(event.data);
}
