import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import IcFacebook from 'src/image/ic-facebook.svg';
import IcLinkedIn from 'src/image/ic-linkedin.svg';
import IcTwitter from 'src/image/ic-twitter.svg';
import { SubscribeForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { sendMessage } from 'src/service/ContactUsService';
import Button from './Button';
import Form from './Form';
import FormInput from './FormInput';

const FooterDetail = () => {
  const dispatch = useDispatch();
  const methods = useForm<SubscribeForm>();

  const onSubmit = (data: SubscribeForm) => {
    sendMessage(data)
      .then(() => {
        dispatch(openSuccessSnackbar('Sent successfully'));
        methods.reset();
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="flex justify-evenly">
        <div>
          <div className="mb-4 text-xl font-bold">Follow us on</div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-2 border-black">
              <img src={IcTwitter} />
            </div>
            <div className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-2 border-black">
              <img src={IcFacebook} />
            </div>
            <div className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-2 border-black">
              <img src={IcLinkedIn} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">Information</div>
          <div>Explore</div>
          <div>About</div>
          <div>FAQ</div>
          <div>Contact Us</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">Legal</div>
          <div>Terms & Conditions</div>
          <div>Cookies Policy</div>
          <div>Privacy Policy</div>
        </div>
        <div>
          <div className="mb-4 text-xl font-bold">Subscribe Newletter</div>
          <Form methods={methods} onSubmit={onSubmit} className="flex">
            <FormInput placeholder="Email" type="email" required name="email" />
            <Button size="s" type="submit">
              →
            </Button>
          </Form>
        </div>
      </div>
      <div className="my-5 text-center">© Copyrights GoTron 2019</div>
    </>
  );
};

export default FooterDetail;
