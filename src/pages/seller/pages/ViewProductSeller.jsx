import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { BlueButton, DarkRedButton, GreenButton } from '../../../utils/buttonStyles';
import { deleteStuff, getProductDetails, updateStuff } from '../../../redux/userHandle';
import { Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Avatar, Box, Card, CircularProgress, Collapse, IconButton, Stack, TextField, Typography } from '@mui/material';
import altImage from "../../../assets/altimg.png";
import Popup from '../../../components/Popup';
import { generateRandomColor, timeAgo } from '../../../utils/helperFunctions';
import { underControl } from '../../../redux/userSlice';
import AlertDialogSlide from '../../../components/AlertDialogSlide';

const ViewProductSeller = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const productID = params.id;

  const [showTab, setShowTab] = useState(false);

  useEffect(() => {
    dispatch(getProductDetails(productID));
  }, [productID, dispatch]);

  const { loading, status, error, productDetails, responseDetails } = useSelector(state => state.user);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState({});
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [dialog, setDialog] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  console.log(price);

  useEffect(() => {
    if (productDetails) {
      setProductName(productDetails.productName || '');
      setPrice(productDetails.price || '');
      setSubcategory(productDetails.subcategory || '');
      setProductImage(productDetails.productImage || '');
      setCategory(productDetails.category || '');
      setDescription(productDetails.description || "");
      setTagline(productDetails.tagline || "");
    }
    if (productDetails.price) {
      setMrp(productDetails.price.mrp || '');
      setCost(productDetails.price.cost || '');
      setDiscountPercent(productDetails.price.discountPercent || '');
    }
  }, [productDetails]);

  const fields = {
    productName,
    price: {
      mrp: mrp,
      cost: cost,
      discountPercent: discountPercent,
    },
    subcategory,
    productImage,
    category,
    description,
    tagline,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateStuff(fields, productID, "ProductUpdate"));
  };

  const deleteHandler = (reviewId) => {
    console.log(reviewId);
    dispatch(updateStuff(fields, productID, "deleteProductReview"));
  };

  const deleteAllHandler = () => {
    dispatch(deleteStuff(productID, "deleteAllProductReviews"));
  };

  useEffect(() => {
    if (status === "updated" || status === "deleted") {
      setLoader(false);
      dispatch(getProductDetails(productID));
      setShowPopup(true);
      setMessage("Done Successfully");
      setShowTab(false);
      dispatch(underControl());
    } else if (error) {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, error, dispatch, productID]);

  const buttonText = showTab ? "Hide Details" : "Show Details";

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {responseDetails ?
            <div>Product not found</div>
            :
            <>
              <ProductContainer>
                <ProductImage src={productDetails && productDetails.productImage} alt={productDetails && productDetails.productName} />
                <ProductInfo>
                  <ProductName>{productDetails && productDetails.productName}</ProductName>
                  <PriceContainer>
                    <PriceCost>₹{productDetails && productDetails.price && productDetails.price.cost}</PriceCost>
                    <PriceMrp>₹{productDetails && productDetails.price && productDetails.price.mrp}</PriceMrp>
                    <PriceDiscount>{productDetails && productDetails.price && productDetails.price.discountPercent}% off</PriceDiscount>
                  </PriceContainer>
                  <Description>{productDetails && productDetails.description}</Description>
                  <ProductDetails>
                    <p>Category: {productDetails && productDetails.category}</p>
                    <p>Subcategory: {productDetails && productDetails.subcategory}</p>
                  </ProductDetails>
                </ProductInfo>
              </ProductContainer>

              <ButtonContainer>
                <GreenButton onClick={() => setShowTab(!showTab)}>
                  {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{buttonText}
                </GreenButton>
              </ButtonContainer>

              <Collapse in={showTab} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: 550,
                      px: 3,
                      py: '30px',
                      width: '100%'
                    }}
                  >
                    <div>
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        {
                          productImage
                            ? <EditImage src={productImage} alt="" />
                            : <EditImage src={altImage} alt="" />
                        }
                      </Stack>
                      <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                          <TextField
                            fullWidth
                            label="Product Image URL"
                            value={productImage}
                            onChange={(event) => setProductImage(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Product Name"
                            value={productName}
                            onChange={(event) => setProductName(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            multiline
                            label="Description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="MRP"
                            value={mrp}
                            onChange={(event) => setMrp(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Cost"
                            value={cost}
                            onChange={(event) => setCost(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Discount Percent"
                            value={discountPercent}
                            onChange={(event) => setDiscountPercent(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Category"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Subcategory"
                            value={subcategory}
                            onChange={(event) => setSubcategory(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Tagline"
                            value={tagline}
                            onChange={(event) => setTagline(event.target.value)}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Stack>
                        <BlueButton
                          fullWidth
                          size="large"
                          sx={{ mt: 3 }}
                          variant="contained"
                          type="submit"
                          disabled={loader}
                        >
                          {loader ? <CircularProgress size={24} color="inherit" /> : "Update"}
                        </BlueButton>
                      </form>
                    </div>
                  </Box>
                </Box>
              </Collapse>

              <ReviewWritingContainer>
                <Typography variant="h4">Reviews</Typography>

                {productDetails.reviews && productDetails.reviews.length > 0 &&
                  <DarkRedButton onClick={() => {
                    setDialog("Do you want to delete all reviews?");
                    setShowDialog(true);
                  }}>
                    Delete All Reviews
                  </DarkRedButton>
                }

                {productDetails.reviews && productDetails.reviews.map((review, index) => (
                  <Card sx={{ p: 2, mb: 1 }} key={index}>
                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      <Avatar
                        sx={{
                          height: 40,
                          width: 40,
                          bgcolor: generateRandomColor(),
                          fontSize: "1rem"
                        }}
                        src={review.avatar}
                      >
                        {review.reviewerName[0]}
                      </Avatar>
                      <Stack direction="column">
                        <Typography variant="subtitle2">{review.reviewerName}</Typography>
                        <Typography variant="caption">{timeAgo(review.createdAt)}</Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="body2" sx={{ mb: 1 }}>{review.review}</Typography>
                    <IconButton onClick={() => deleteHandler(review._id)} aria-label="delete">
                      <Delete />
                    </IconButton>
                  </Card>
                ))}
              </ReviewWritingContainer>

              <AlertDialogSlide
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                dialog={dialog}
                handleAgree={deleteAllHandler}
              />

              <Popup
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                message={message}
                severity="success"
              />
            </>
          }
        </>
      }
    </>
  );
};

export default ViewProductSeller;

// Styled components

const ProductContainer = styled.div`
  display: flex;
  margin: 20px;
`;

const ProductImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
`;

const ProductInfo = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PriceCost = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 10px;
`;

const PriceMrp = styled.span`
  font-size: 1.2rem;
  text-decoration: line-through;
  color: gray;
  margin-right: 10px;
`;

const PriceDiscount = styled.span`
  font-size: 1.2rem;
  color: green;
`;

const Description = styled.p`
  margin-bottom: 10px;
`;

const ProductDetails = styled.div`
  p {
    margin: 0;
    margin-bottom: 5px;
  }
`;

const ButtonContainer = styled.div`
  margin: 20px 0;
`;

const EditImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
`;

const ReviewWritingContainer = styled.div`
  margin-top: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;
