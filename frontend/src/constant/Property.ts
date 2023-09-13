type Property = {
  name: string;
  note?: string;
};

export const Role: Property[] = [
  { name: 'Composer', note: 'Upload audio melody tracks' },
  { name: 'Lyricist', note: 'Fill in lyrics for melodies' },
  { name: 'Singer', note: 'Record demo for songs' },
  { name: 'Producer', note: 'Remaster songs to implement sophisticated music components' },
];

export const Genre: Property[] = [{ name: 'Pop' }, { name: 'Rock' }, { name: 'Electronics' }];

export const Language: Property[] = [
  { name: 'Cantonese' },
  { name: 'English' },
  { name: 'Mandarin' },
];

export const Theme: Property[] = [{ name: 'Romantic' }, { name: 'Relax' }, { name: 'Deep Focus' }];

export const Instrument: Property[] = [{ name: 'Piano' }, { name: 'Drum' }, { name: 'Guitar' }];
