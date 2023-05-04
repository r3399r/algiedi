import Input from 'src/component/Input';
import Textarea from 'src/component/Textarea';

const Lyrics = () => (
  <div className="flex gap-6">
    <div className="w-3/5">
      <Input className="mb-4" placeholder="Name of your creation" />
      <Textarea className="h-[240px]" label="Song Description" />
    </div>
    <div className="w-2/5">
      <Input className="mb-4" label="Theme" />
      <Input className="mb-4" label="Genre" />
      <Input className="mb-4" label="Language" />
      <Input label="Caption" />
    </div>
  </div>
);

export default Lyrics;
