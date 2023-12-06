import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import FormTextarea from 'src/component/FormTextarea';
import IcFacebook from 'src/image/ic-facebook.svg';
import IcInstagram from 'src/image/ic-instagram.svg';
import IcInvite from 'src/image/ic-invite.svg';
import IcTwitter from 'src/image/ic-twitter.svg';
import PicLocation from 'src/image/pic-location.png';
import { ContactForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { sendMessage } from 'src/service/ContactUsService';

const ContactUs = () => {
  const dispatch = useDispatch();
  const methods = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => {
    sendMessage(data)
      .then(() => {
        dispatch(openSuccessSnackbar('Sent successfully'));
        methods.reset();
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <div>
      <div className="mx-10 mb-20 flex flex-wrap items-center">
        <div className="mr-10 border-r-[1px] border-black pr-10 text-[50px] font-bold">
          Contact us
        </div>
        <div>
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <div className="flex gap-2">
              <img className="h-5 w-5" src={IcInvite} />
              <div className="w-[160px]">contact@gotron.com</div>
            </div>
            <div className="flex gap-2">
              <img className="h-5 w-5" src={IcTwitter} />
              <div className="w-[160px]">#gotronmusic</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <div className="flex gap-2">
              <img className="h-5 w-5" src={IcInstagram} />
              <div className="w-[160px]">@gotronmusic</div>
            </div>
            <div className="flex gap-2">
              <img className="h-5 w-5" src={IcFacebook} />
              <div className="w-[160px]">gotronmusic</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-l from-[#fff8c4] to-[#00c3ff]">
        <div className="flex flex-col items-center gap-8 p-5 sm:flex-row">
          <Form methods={methods} onSubmit={onSubmit} className="w-full px-5 sm:w-1/2">
            <div className="flex gap-1">
              <div className="w-1/2">
                <FormInput name="firstName" label="First name" required />
              </div>
              <div className="w-1/2">
                <FormInput name="surname" label="Surname" required />
              </div>
            </div>
            <div className="my-5">
              <FormInput name="email" label="Email" required type="email" />
            </div>
            <FormTextarea name="message" placeholder="Message..." required />
            <div className="mt-5 text-center">
              <Button color="transparent" type="submit">
                Send
              </Button>
            </div>
          </Form>
          <div className="sm:w-1/2">
            <img src={PicLocation} />
          </div>
        </div>
        <div className="mx-auto max-w-[630px] py-16">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
