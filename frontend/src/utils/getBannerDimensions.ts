export default function getBannerDimensions (size: number) {

    const banner_height = size * 0.9;
    const banner_width = banner_height * 0.8;

    return [banner_width, banner_height];
}