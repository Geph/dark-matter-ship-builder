import PortraitUpload from './PortraitUpload';

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

export default function ShipImageUpload({ value, onChange }: Props) {
  return (
    <PortraitUpload
      label="SHIP PORTRAIT"
      hint="Upload a picture of your ship for the view page. Images are center-cropped to 16:9 widescreen. Registry emblems are chosen separately on My Ships."
      value={value}
      onChange={onChange}
      aspectRatio={16 / 9}
      maxWidth={854}
      uploadPrompt="+ Upload Ship Picture (16:9)"
    />
  );
}
