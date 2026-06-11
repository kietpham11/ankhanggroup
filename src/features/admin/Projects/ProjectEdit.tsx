import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowLeft, UploadCloud, Plus, X,
  Bold, Italic, Underline, List, ListOrdered, Link, Image as ImageIcon
} from 'lucide-react';
import { getFullImgUrl, propertiesAPI } from '../../../lib/api';
import './ProjectEdit.css';

interface ProjectEditProps {
  project: any;
  onBack: () => void;
  onSave: (updatedProject: any) => void;
}

type LocationOptions = Record<string, Record<string, string[]>>;

type ProvinceApiItem = {
  code: number;
  name: string;
  wards?: { name: string }[];
  districts?: {
    code: number;
    name: string;
    wards?: { name: string }[];
  }[];
};

const FALLBACK_LOCATION_OPTIONS: LocationOptions = {
  'Hồ Chí Minh': {
    '': ['Phường Sài Gòn', 'Phường Bến Thành', 'Phường Tân Định', 'Phường Thủ Đức'],
  },
  'Đồng Nai': {
    '': ['Phường Trảng Dài', 'Phường Hố Nai', 'Phường Tam Hiệp', 'Phường Long Bình', 'Xã Long Thành'],
  },
};

const normalizeProvinceName = (name: string) => name.replace(/^(Tỉnh|Thành phố)\s+/u, '');
const normalizeDistrictName = (name: string) => (
  name.replace(/^(Huyện|Thành phố|Thị xã)\s+/u, '')
);

const toLocationOptions = (provinces: ProvinceApiItem[]): LocationOptions => {
  return provinces.reduce<LocationOptions>((provinceMap, province) => {
    if (!province.name) return provinceMap;

    if (province.wards) {
      provinceMap[normalizeProvinceName(province.name)] = {
        '': province.wards.map((ward) => ward.name).filter(Boolean),
      };
      return provinceMap;
    }

    provinceMap[normalizeProvinceName(province.name)] = (province.districts || []).reduce<Record<string, string[]>>(
      (districtMap, district) => {
        if (!district.name) return districtMap;
        districtMap[normalizeDistrictName(district.name)] = (district.wards || [])
          .map((ward) => ward.name)
          .filter(Boolean);
        return districtMap;
      },
      {}
    );

    return provinceMap;
  }, {});
};

export default function ProjectEdit({ project, onBack, onSave }: ProjectEditProps) {
  // Parsed initial state
  const initialAmenities = project.amenities ? JSON.parse(project.amenities) : ['', '', ''];
  
  const [amenities, setAmenities] = useState<string[]>(
    initialAmenities.length > 0 ? initialAmenities : ['', '', '']
  );
  const [mainImage, setMainImage] = useState<string>(project.images?.[0] || '');
  const [gallery, setGallery] = useState<string[]>(project.images?.slice(1) || []);
  const [mapImage, setMapImage] = useState<string>(project.mapImage || '');
  const [isUploading, setIsUploading] = useState(false);
  
  const [showOnHome, setShowOnHome] = useState(project.showOnHome || false);
  const [isFeatured, setIsFeatured] = useState(project.isFeatured || false);
  const [selectedProvince, setSelectedProvince] = useState(project.province || '');
  const [selectedDistrict, setSelectedDistrict] = useState(project.district || '');
  const [selectedWard, setSelectedWard] = useState(project.ward || '');
  const [locationOptions, setLocationOptions] = useState<LocationOptions>(FALLBACK_LOCATION_OPTIONS);
  const [provinceCodes, setProvinceCodes] = useState<Record<string, number>>({});
  const [loadedProvinces, setLoadedProvinces] = useState<Record<string, boolean>>({});
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState('');

  const provinceLocation = selectedProvince ? locationOptions[selectedProvince] || {} : {};
  const districts = Object.keys(provinceLocation).filter(Boolean);
  const wards = selectedProvince
    ? (districts.length > 0 && selectedDistrict
      ? provinceLocation[selectedDistrict] || []
      : provinceLocation[''] || [])
    : [];

  useEffect(() => {
    let isMounted = true;

    const loadProvinces = async () => {
      try {
        setIsLoadingLocations(true);
        const res = await fetch('https://provinces.open-api.vn/api/v2/p/');
        if (!res.ok) throw new Error('Không tải được danh sách địa giới');

        const data = await res.json() as ProvinceApiItem[];
        const nextProvinceCodes = data.reduce<Record<string, number>>((map, province) => {
          map[normalizeProvinceName(province.name)] = province.code;
          return map;
        }, {});
        const nextOptions = data.reduce<LocationOptions>((map, province) => {
          map[normalizeProvinceName(province.name)] = {};
          return map;
        }, {});

        if (isMounted && Object.keys(nextOptions).length > 0) {
          setProvinceCodes(nextProvinceCodes);
          setLocationOptions({ ...nextOptions, ...FALLBACK_LOCATION_OPTIONS });
        }
      } catch (error) {
        console.warn('Không tải được danh sách địa giới, dùng dữ liệu dự phòng.', error);
      } finally {
        if (isMounted) setIsLoadingLocations(false);
      }
    };

    loadProvinces();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProvince || loadedProvinces[selectedProvince]) return;

    const provinceCode = provinceCodes[selectedProvince];
    if (!provinceCode) return;

    let isMounted = true;

    const loadProvinceDetail = async () => {
      try {
        setLoadingProvince(selectedProvince);
        const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`);
        if (!res.ok) throw new Error('Không tải được phường xã');

        const province = await res.json() as ProvinceApiItem;
        const provinceName = normalizeProvinceName(province.name);
        const nextOptions = toLocationOptions([province]);
        const districtMap = nextOptions[provinceName] || {};

        if (isMounted && Object.keys(districtMap).length > 0) {
          setLocationOptions((prev) => ({ ...prev, [provinceName]: districtMap }));
          setLoadedProvinces((prev) => ({ ...prev, [provinceName]: true }));
        }
      } catch (error) {
        console.warn('Không tải được quận huyện phường xã, dùng dữ liệu dự phòng.', error);
      } finally {
        if (isMounted) setLoadingProvince('');
      }
    };

    loadProvinceDetail();

    return () => {
      isMounted = false;
    };
  }, [loadedProvinces, provinceCodes, selectedProvince]);

  const editorRef = useRef<HTMLDivElement>(null);
  
  // Basic Info Refs
  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const provinceRef = useRef<HTMLSelectElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);
  const wardRef = useRef<HTMLSelectElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);
  const roomCountRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  
  // Extra Info Refs
  const developerRef = useRef<HTMLInputElement>(null);
  const ownershipRef = useRef<HTMLSelectElement>(null);
  const partnerRef = useRef<HTMLInputElement>(null);
  const totalUnitsRef = useRef<HTMLInputElement>(null);
  const legalRef = useRef<HTMLInputElement>(null);
  const handoverDateRef = useRef<HTMLInputElement>(null);
  
  // Map Info Refs
  const mapAddressRef = useRef<HTMLInputElement>(null);
  const mapImageInputRef = useRef<HTMLInputElement>(null);
  
  // Status Refs
  const displayStatusRef = useRef<HTMLSelectElement>(null);
  const displayOrderRef = useRef<HTMLInputElement>(null);

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0], setMainImage);
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setIsUploading(true);
      try {
        const uploadPromises = files.map(f => propertiesAPI.uploadImage(f));
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map(r => r.url);
        setGallery([...gallery, ...newUrls]);
      } catch (err: any) {
        alert('Lỗi upload ảnh phụ');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const uploadFile = async (file: File, setter: (url: string) => void) => {
    try {
      setIsUploading(true);
      const data = await propertiesAPI.uploadImage(file);
      setter(data.url);
    } catch (err: any) {
      alert('Lỗi upload ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveBtn = () => {
    const updatedProject = {
      ...project,
      name: nameRef.current?.value || project.name,
      slug: slugRef.current?.value || project.slug,
      location: locationRef.current?.value || project.location,
      category: categoryRef.current?.value || project.category,
      province: selectedProvince,
      district: '',
      ward: selectedWard,
      area: areaRef.current?.value || project.area,
      roomCount: roomCountRef.current?.value ?? project.roomCount ?? '',
      price: priceRef.current?.value || project.price || '',
      status: statusRef.current?.value || project.status,
      
      developer: developerRef.current?.value || project.developer,
      ownership: ownershipRef.current?.value || project.ownership,
      partner: partnerRef.current?.value || project.partner,
      totalUnits: totalUnitsRef.current?.value || project.totalUnits,
      legal: legalRef.current?.value || project.legal,
      handoverDate: handoverDateRef.current?.value || project.handoverDate,
      
      mapAddress: mapAddressRef.current?.value || project.mapAddress,
      mapCoordinates: '',
      mapImage,
      
      displayOrder: displayOrderRef.current?.value || project.displayOrder,
      showOnHome: showOnHome,
      isFeatured: isFeatured,
      
      amenities: JSON.stringify(amenities.filter(a => a.trim() !== '')),
      
      content: editorRef.current?.innerHTML || project.content,
      images: [mainImage, ...gallery.filter((g: string) => g !== mainImage)].filter(Boolean),
    };
    onSave(updatedProject);
  };

  return (
    <div className="pe-container">
      {/* Header */}
      <div className="pe-header">
        <div className="pe-header-left">
          <div className="pe-breadcrumb">
            Quản lý dự án <span className="pe-sep">›</span> <span className="pe-current">Thêm dự án</span>
          </div>
          <h2 className="pe-title">Thêm dự án</h2>
          <p className="pe-subtitle">Tạo mới thông tin dự án bất động sản</p>
        </div>
        <div className="pe-header-right">
          <button className="pe-btn-cancel" onClick={onBack}>
            <ArrowLeft size={16} /> Quay lại danh sách
          </button>
          <button className="pe-btn-save" onClick={handleSaveBtn} disabled={isUploading}>
            {isUploading ? 'Đang tải...' : 'Lưu dự án'}
          </button>
        </div>
      </div>

      {/* Section 1: Basic Info */}
      <div className="pe-section">
        <h3 className="pe-section-title">THÔNG TIN CƠ BẢN</h3>
        <div className="pe-grid-3">
          <div className="pe-form-group">
            <label>Tên dự án <span className="pe-req">*</span></label>
            <input type="text" ref={nameRef} defaultValue={project.name} placeholder="Nhập tên dự án" />
          </div>
          <div className="pe-form-group">
            <label>Mã dự án (mã nội bộ)</label>
            <input type="text" ref={slugRef} defaultValue={project.slug} placeholder="Nhập mã dự án" />
          </div>
          <div className="pe-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Vị trí dự án <span className="pe-req">*</span></label>
            <input type="text" ref={locationRef} defaultValue={project.location} placeholder="Nhập vị trí dự án" />
          </div>
          
          <div className="pe-form-group">
            <label>Danh mục dự án <span className="pe-req">*</span></label>
            <select ref={categoryRef} defaultValue={project.category || ''}>
              <option value="">Chọn loại hình</option>
              <option value="Đất nền">Đất nền</option>
              <option value="Căn hộ">Căn hộ</option>
              <option value="Nhà lầu trệt">Nhà lầu trệt</option>
              <option value="Nhà cấp 4">Nhà cấp 4</option>
              <option value="Nhà cấp 4 gác lửng">Nhà cấp 4 gác lửng</option>
              <option value="Biệt thự mini">Biệt thự mini</option>
              <option value="Biệt thự sân vườn">Biệt thự sân vườn</option>
              <option value="Cấp 4 sân vườn">Cấp 4 sân vườn</option>
            </select>
          </div>
          <div className="pe-form-group">
            <label>Tỉnh / Thành phố <span className="pe-req">*</span></label>
            <select
              ref={provinceRef}
              value={selectedProvince}
              onChange={(e) => {
                const nextProvince = e.target.value;
                setSelectedProvince(nextProvince);
                setSelectedDistrict('');
                setSelectedWard('');
                if (nextProvince && provinceCodes[nextProvince] && !loadedProvinces[nextProvince]) {
                  setLoadingProvince(nextProvince);
                }
              }}
            >
              <option value="">{isLoadingLocations ? 'Đang tải tỉnh / thành phố...' : 'Chọn tỉnh / thành phố'}</option>
              {Object.keys(locationOptions).map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          <div className="pe-form-group">
            <label>Quận / Huyện</label>
            <select
              ref={districtRef}
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedWard('');
              }}
              disabled
            >
              <option value="">
                Không áp dụng sau sáp nhập
              </option>
            </select>
          </div>
          
          <div className="pe-form-group">
            <label>Diện tích đất (m²)</label>
            <input type="text" ref={areaRef} defaultValue={project.area} placeholder="Nhập diện tích" />
          </div>
          <div className="pe-form-group">
            <label>Giá bán (VNĐ)</label>
            <input type="text" ref={priceRef} defaultValue={project.price || ''} placeholder="Ví dụ: 2950000000" />
          </div>
          <div className="pe-form-group">
            <label>Phường / Xã</label>
            <select
              ref={wardRef}
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedProvince || loadingProvince === selectedProvince}
            >
              <option value="">
                {loadingProvince === selectedProvince ? 'Đang tải phường / xã...' : 'Chọn phường / xã'}
              </option>
              {wards.map((ward) => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          </div>
          <div className="pe-form-group">
            <label>Tình trạng dự án <span className="pe-req">*</span></label>
            <select ref={statusRef} defaultValue={project.status || ''}>
              <option value="">Chọn tình trạng</option>
              <option value="Đang mở bán">Đang mở bán</option>
              <option value="Sắp mở bán">Sắp mở bán</option>
              <option value="Đã bàn giao">Đã bàn giao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Images */}
      <div className="pe-section">
        <h3 className="pe-section-title">HÌNH ẢNH DỰ ÁN</h3>
        <div className="pe-grid-2">
          <div className="pe-form-group">
            <label>Ảnh đại diện dự án <span className="pe-req">*</span></label>
            <div className="pe-upload-box">
              {mainImage ? (
                <div className="pe-img-preview">
                  <img src={getFullImgUrl(mainImage)} alt="Main" />
                  <button className="pe-remove-btn" onClick={() => setMainImage('')}><X size={16}/></button>
                </div>
              ) : (
                <div className="pe-upload-content">
                  <UploadCloud size={24} className="pe-icon-upload" />
                  <p>Kéo thả ảnh vào đây</p>
                  <p>hoặc</p>
                  <label className="pe-btn-outline">
                    Chọn ảnh
                    <input type="file" accept="image/*" hidden onChange={handleMainImageChange} />
                  </label>
                </div>
              )}
            </div>
            <p className="pe-help-text">JPG, PNG, WebP. Kích thước đề xuất: 1920x1080px</p>
          </div>

          <div className="pe-form-group">
            <label>Thư viện hình ảnh</label>
            <div className="pe-upload-box">
              <div className="pe-upload-content">
                <UploadCloud size={24} className="pe-icon-upload" />
                <p>Kéo thả nhiều ảnh vào đây</p>
                <p>hoặc</p>
                <label className="pe-btn-outline">
                  Chọn nhiều ảnh
                  <input type="file" accept="image/*" multiple hidden onChange={handleGalleryChange} />
                </label>
              </div>
            </div>
            <p className="pe-help-text">JPG, PNG, WebP. Tối đa 10MB/ảnh</p>
            {gallery.length > 0 && (
              <div className="pe-gallery-preview">
                {gallery.map((img, i) => (
                  <div key={i} className="pe-img-preview small">
                    <img src={getFullImgUrl(img)} alt="Gallery" />
                    <button className="pe-remove-btn" onClick={() => {
                      const newG = [...gallery]; newG.splice(i, 1); setGallery(newG);
                    }}><X size={14}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Detail Info */}
      <div className="pe-section">
        <h3 className="pe-section-title">THÔNG TIN CHI TIẾT</h3>
        <div className="pe-form-group">
          <label>Tổng quan dự án <span className="pe-req">*</span></label>
          <div className="pe-editor-toolbar">
            <button><Bold size={16} /></button>
            <button><Italic size={16} /></button>
            <button><Underline size={16} /></button>
            <div className="pe-divider"></div>
            <button><List size={16} /></button>
            <button><ListOrdered size={16} /></button>
            <div className="pe-divider"></div>
            <button><Link size={16} /></button>
            <button><ImageIcon size={16} /></button>
          </div>
          <div 
            className="pe-editor-content" 
            contentEditable 
            ref={editorRef}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: project.content || '' }}
            data-placeholder="Nhập tổng quan dự án..."
          ></div>
        </div>

        <div className="pe-grid-2" style={{ marginTop: '24px' }}>
          {/* Left: Amenities */}
          <div className="pe-card-inner">
            <h4 className="pe-card-title">TIỆN ÍCH NỔI BẬT</h4>
            {amenities.map((amenity, idx) => (
              <div className="pe-form-group pe-flex-row" key={idx}>
                <label style={{ width: '80px', marginBottom: 0 }}>Tiện ích {idx + 1}</label>
                <input 
                  type="text" 
                  value={amenity}
                  onChange={e => {
                    const newAm = [...amenities];
                    newAm[idx] = e.target.value;
                    setAmenities(newAm);
                  }}
                  placeholder="Nhập tiện ích nổi bật" 
                />
              </div>
            ))}
            <button 
              className="pe-btn-dashed"
              onClick={() => setAmenities([...amenities, ''])}
            >
              <Plus size={16} /> Thêm tiện ích
            </button>
          </div>

          {/* Right: Extra Info */}
          <div className="pe-card-inner">
            <h4 className="pe-card-title">THÔNG TIN THÊM</h4>
            <div className="pe-grid-2">
              <div className="pe-form-group">
                <label>Chủ đầu tư</label>
                <input type="text" ref={developerRef} defaultValue={project.developer} placeholder="Nhập chủ đầu tư" />
              </div>
              <div className="pe-form-group">
                <label>Hình thức sở hữu</label>
                <select ref={ownershipRef} defaultValue={project.ownership || ''}>
                  <option value="">Chọn hình thức sở hữu</option>
                  <option value="Sổ hồng lâu dài">Sổ hồng lâu dài</option>
                  <option value="50 năm">50 năm</option>
                </select>
              </div>
              <div className="pe-form-group">
                <label>Đơn vị phát triển</label>
                <input type="text" ref={partnerRef} defaultValue={project.partner} placeholder="Nhập đơn vị phát triển" />
              </div>
              <div className="pe-form-group">
                <label>Số lượng sản phẩm</label>
                <input type="text" ref={totalUnitsRef} defaultValue={project.totalUnits} placeholder="Nhập số lượng sản phẩm" />
              </div>
              <div className="pe-form-group">
                <label>Số phòng</label>
                <input type="number" min="0" ref={roomCountRef} defaultValue={project.roomCount || ''} placeholder="Nhập số phòng" />
              </div>
              <div className="pe-form-group">
                <label>Pháp lý</label>
                <input type="text" ref={legalRef} defaultValue={project.legal} placeholder="Nhập thông tin pháp lý" />
              </div>
              <div className="pe-form-group">
                <label>Thời gian bàn giao</label>
                <input type="text" ref={handoverDateRef} defaultValue={project.handoverDate} placeholder="Chọn thời gian" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Location image */}
      <div className="pe-section">
        <h3 className="pe-section-title">ẢNH VỊ TRÍ DỰ ÁN</h3>
        <div className="pe-grid-2">
          <div>
            <div className="pe-form-group">
              <label>Địa chỉ hiển thị trên website</label>
              <input type="text" ref={mapAddressRef} defaultValue={project.mapAddress} placeholder="Nhập địa chỉ sẽ hiển thị" />
            </div>
            <p className="pe-help-text">Ảnh này sẽ thay cho bản đồ Google trên trang chi tiết dự án.</p>
          </div>
          <div className="pe-form-group">
            <label>Ảnh vị trí</label>
            <div className="pe-map-preview pe-map-upload">
              {mapImage ? (
                <>
                  <img src={getFullImgUrl(mapImage)} alt="Ảnh vị trí dự án" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <button className="pe-remove-btn" onClick={() => setMapImage('')} style={{ position: 'absolute', top: 10, right: 10, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xóa ảnh"><X size={12} /></button>
                </>
              ) : (
                <button className="pe-map-upload-empty" onClick={() => mapImageInputRef.current?.click()} style={{ width: '100%', height: '250px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                  <UploadCloud size={32} style={{ marginBottom: '8px' }} />
                  <span>Click để thêm ảnh vị trí</span>
                </button>
              )}
              {mapImage && (
                <button className="pe-btn-change-map" onClick={() => mapImageInputRef.current?.click()} style={{ marginTop: '10px', background: 'var(--navy-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Đổi ảnh
                </button>
              )}
              <input
                type="file"
                hidden
                ref={mapImageInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) uploadFile(e.target.files[0], setMapImage);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Status */}
      <div className="pe-section">
        <h3 className="pe-section-title">TRẠNG THÁI</h3>
        <div className="pe-grid-2">
          <div className="pe-card-inner">
            <h4 className="pe-card-title">Trạng thái dự án</h4>
            <div className="pe-form-group">
              <label>Trạng thái hiển thị <span className="pe-req">*</span></label>
              <select ref={displayStatusRef}>
                <option value="Hiển thị">Hiển thị</option>
                <option value="Ẩn">Ẩn</option>
              </select>
            </div>
            <p className="pe-help-text">Dự án sẽ được hiển thị trên website sau khi lưu.</p>
          </div>
          <div className="pe-card-inner">
            <h4 className="pe-card-title">Thông tin hiển thị</h4>
            <div className="pe-grid-2">
              <div className="pe-form-group">
                <div className="pe-toggle-row">
                  <label>Nổi bật</label>
                  <div className={`pe-toggle ${isFeatured ? 'active' : ''}`} onClick={() => setIsFeatured(!isFeatured)}>
                    <div className="pe-toggle-thumb"></div>
                  </div>
                </div>
              </div>
              <div className="pe-form-group">
                <label>Thứ tự hiển thị</label>
                <input type="number" ref={displayOrderRef} defaultValue={project.displayOrder || 1} />
                <p className="pe-help-text">Số thứ tự nhỏ hơn sẽ hiển thị trước</p>
              </div>
              <div className="pe-form-group">
                <div className="pe-toggle-row">
                  <label>Hiển thị trang chủ</label>
                  <div className={`pe-toggle ${showOnHome ? 'active' : ''}`} onClick={() => setShowOnHome(!showOnHome)}>
                    <div className="pe-toggle-thumb"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pe-footer">
        <button className="pe-btn-cancel-lg" onClick={onBack}>Hủy bỏ</button>
        <button className="pe-btn-save-lg" onClick={handleSaveBtn} disabled={isUploading}>Lưu dự án</button>
      </div>
    </div>
  );
}
