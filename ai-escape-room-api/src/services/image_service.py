import os, io, base64
from PIL import Image
import cv2 as cv
import numpy as np

def convert_images_into_blob(img_name: str) -> str:
    """Loads an image from the local sprites folder and returns it as base64 PNG text.

    Input: image file name inside `./sprites/`.
    Output: base64-encoded PNG string.
    """
    root_folder = './sprites/'
    with open(root_folder+img_name, 'rb') as image_file:
        image = Image.open(image_file)
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_blob = img_byte_arr.getvalue()
        img_base64 = base64.b64encode(img_blob).decode('utf-8')
    return img_base64

def generatePerspectiveTransformationsOfImage(imgName: str) -> None:
    """Creates left and right perspective variants of a sprite image on disk.

    Input: image file name inside the local `sprites` directory.
    Output: no return value; writes transformed PNG files next to the source image.
    """
    root = os.getcwd()
    imgPath = os.path.join(root, 'sprites/', imgName)
    img = cv.imread(imgPath, cv.IMREAD_UNCHANGED)

    height, width = img.shape[:2]

    p1 = np.array([[0, 0],[width, 0],[0, height],[width, height]], dtype=np.float32)

    perspective = height/6.75

    r = np.array([[perspective, perspective],[width - perspective, 0],[perspective, height - perspective],[width - perspective, height]], dtype=np.float32)
    l = np.array([[perspective, 0],[width - perspective, perspective],[perspective, height],[width - perspective, height-perspective]], dtype=np.float32)

    RT = cv.getPerspectiveTransform(p1, r)
    LT = cv.getPerspectiveTransform(p1, l)

    rightImgTrans = cv.warpPerspective(img, RT, (width, height))
    leftImgTrans = cv.warpPerspective(img, LT, (width, height))

    filename = imgName.replace('.png', '')
    cv.imwrite(os.path.join(root, 'sprites/', f'{filename}_right_perspective.png'), rightImgTrans)
    cv.imwrite(os.path.join(root, 'sprites/', f'{filename}_left_perspective.png'), leftImgTrans)
