import { useState, useEffect, useRef } from 'react';
import './App.css';
import AddressDropdown from './components/AddressDropdown';
import FileInput from './components/FileInput';
import Snowfall from './components/Snowfall';

const imageUrls = [
  '/images/photo_1.png',
  '/images/photo_2.png',
  '/images/photo_3.png',
  '/images/photo_4.png',
  '/images/photo_5.png',
  '/images/photo_6.png',
];

function App() {
  const [phone, setPhone] = useState('');
  const [lotteryNumber, setLotteryNumber] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [quarterId, setQuarterId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const carouselRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % imageUrls.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isDesktop = windowWidth >= 900;
  const isTablet = windowWidth >= 600 && windowWidth < 900;

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPhone(value);
  };

  const handleAddressChange = ({ cityId, districtId, quarterId }) => {
    setCityId(cityId || '');
    setDistrictId(districtId || '');
    setQuarterId(quarterId || '');
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !lotteryNumber || !selectedFile) {
      showMessage('Бүх талбарыг бөглөнө үү!', 'error');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('phone_number', phone);
    formData.append('lottery_number', lotteryNumber);
    formData.append('aimag', cityId);
    formData.append('sum', districtId);
    formData.append('horoo', quarterId);
    formData.append('status', 'pending');
    formData.append('ebarimt_picture', selectedFile);

    try {
      const response = await fetch('https://mglrndm.online/lotteries/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showMessage('Амжилттай илгээв!', 'success');
        setPhone('');
        setLotteryNumber('');
        setSelectedFile(null);
      } else {
        showMessage(`Амжилтгүй: ${response.status}`, 'error');
      }
    } catch (error) {
      showMessage(`Алдаа гарлаа: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <div className={`form-wrapper ${isDesktop ? 'desktop' : ''}`}>
      <div className="form-container">
        <div className="logo-container">
          <img src="/images/logo.png" alt="MAH Logo" className="logo" style={{ height: isDesktop ? 80 : 60 }} />
        </div>

        <div style={{ height: isDesktop ? 30 : 20 }} />

        <h2 className="title">
          Шинэ оны мэнд! 🎉
          <br />
          Урамшууллын дугаар аа бүртгүүлнэ үү
        </h2>

        <div style={{ height: isDesktop ? 30 : 20 }} />

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Утасны дугаар</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder=""
              maxLength={8}
            />
          </div>

          <div className="input-group">
            <label>Урамшууллын дугаар</label>
            <input
              type="text"
              value={lotteryNumber}
              onChange={(e) => setLotteryNumber(e.target.value)}
              placeholder=""
            />
          </div>

          <FileInput
            label="И-Баримт зураг"
            onFileSelected={setSelectedFile}
            selectedFile={selectedFile}
          />

          <div className="input-group">
            <label>Хаяг сонгон уу</label>
            <AddressDropdown onChanged={handleAddressChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Илгээж байна...' : 'Урамшуулалд оролцох'}
          </button>
        </form>

        <p className="company-name">МАХ ИМПЭКС ХХК</p>
      </div>
    </div>
  );

  const renderCarousel = () => (
    <div className={`carousel-container ${isDesktop ? 'desktop' : ''}`} style={{ height: isDesktop ? 720 : isTablet ? 300 : 200 }}>
      {!isDesktop ? (
        <img src="/images/cover.png" alt="Cover" className="cover-image" />
      ) : (
        <div className="carousel" ref={carouselRef}>
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {imageUrls.map((url, index) => (
              <div key={index} className="carousel-slide">
                <img src={url} alt={`Promo ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="snow-overlay" style={{ backgroundImage: "url('/images/snow.jpeg')" }}></div>
          <div className="carousel-dots">
            {imageUrls.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentPage === index ? 'active' : ''}`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <Snowfall count={isDesktop ? 20 : 8} minSize={isDesktop ? 20 : 12} />

      {message.text && (
        <div className={`snackbar ${message.type}`}>
          {message.text}
        </div>
      )}

      {isDesktop ? (
        <div className="desktop-layout">
          {renderForm()}
          {renderCarousel()}
        </div>
      ) : (
        <div className="mobile-layout">
          {renderCarousel()}
          {renderForm()}
        </div>
      )}
    </div>
  );
}

export default App;
