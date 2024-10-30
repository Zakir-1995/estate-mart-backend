import Listing from "../models/listing.model.js";
import cloudinary from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";
dotenv.config();
export const createListing = async (req, res, next) => {
  const { listingData } = req.body;
  const { images, ...rest } = listingData;
  const allImages = images.map(async (img) => {
    const result = await cloudinary.uploader.upload(img, {
      folder: "estate-mart",
    });
    return result;
  });

  const uploadedImages = await Promise.all(allImages);

  let files = [];

  for (let i = 0; i < uploadedImages.length; i++) {
    let file = uploadedImages[i];
    files.push({
      url: file.url,
      public_id: file.public_id,
    });
  }
  try {
    const listing = await Listing.create({
      ...rest,
      images: files,
    });
    return res.status(201).json({
      message: "New listing created!",
      error: false,
      success: true,
      data: listing,
    });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

export const getSearchListing = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.furnished;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

export const getAllListing = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    return res.status(200).json({
      error: false,
      success: true,
      data: listings,
    });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

export const getSingleListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id });
    return res.status(200).json({
      error: false,
      success: true,
      data: listing,
    });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

export const updateListing = async (req, res, next) => {
  const { data } = req.body;
  const {
    name,
    description,
    address,
    bedroom,
    bathroom,
    furnished,
    offer,
    type,
    regularPrice,
    discountPrice,
    parking,
    userRef,
    images,
  } = data;

  try {
    const listing = await Listing.findOne({ _id: req.params.id });

    let result = listing.images.filter(
      (img1) => !images.flat().some((img2) => img1.public_id === img2.public_id)
    );

    if (result) {
      result.map(async (item) => {
        await cloudinary.uploader.destroy(item.public_id, {
          folder: "estate-mart",
        });
      });
    }

    let result2 = listing.images.filter((img1) =>
      images.flat().some((img2) => img1.public_id === img2.public_id)
    );
    let result3 = images
      .flat()
      .filter(
        (img1) =>
          !listing.images.some((img2) => img1.public_id === img2.public_id)
      );

    const allImages = result3.map(async (img) => {
      const result = await cloudinary.uploader.upload(img.url, {
        folder: "estate-mart",
      });
      return result;
    });

    const uploadedImages = await Promise.all(allImages);

    let files = [];

    for (let i = 0; i < uploadedImages.length; i++) {
      let file = uploadedImages[i];
      files.push({
        url: file.url,
        public_id: file.public_id,
      });
    }
    const updatedFiles = [...files, ...result2];

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name ? name : listing.name,
          description: description ? description : listing.description,
          address: address ? address : listing.address,
          regularPrice: regularPrice ? regularPrice : listing.regularPrice,
          discountPrice: discountPrice,
          bedroom: bedroom ? bedroom : listing.bedroom,
          bathroom: bathroom ? bathroom : listing.bathroom,
          furnished: furnished ? furnished : listing.furnished,
          parking: parking ? parking : listing.parking,
          type: type ? type : listing.type,
          offer: offer ? offer : listing.offer,
          userRef: userRef ? userRef : listing.userRef,
          images: updatedFiles ? updatedFiles : listing.images,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Listing Updated!",
      error: false,
      success: true,
      data: updatedListing,
    });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById({ _id: req.params.id });

    listing.images.map(async (img) => {
      const imgId = img.public_id;
      await cloudinary.uploader.destroy(imgId, {
        folder: "estate-mart",
      });
    });

    await Listing.findByIdAndDelete(req?.params.id);

    return res.status(200).json({
      message: "Listing Deleted Successfully!",
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(200).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};
