import React from 'react';
import {Box, Card, CardContent, CardHeader, CircularProgress, Typography} from '@mui/material';
import {Pie} from 'react-chartjs-2';
import Link from "next/link";

const CardComponent = ({headers, values, loading, chartData, href, hrefIndex}) => (
      <Card
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mb: 0,
                borderCollapse: 'collapse',
                borderRadius: 0
            }}
      >
          <CardHeader
                title={
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        {headers.map((header, index) => (
                              <Typography key={index} variant="h6" sx={{
                                  flex: 1,
                                  textAlign: 'center',
                                  borderRight: index < headers.length - 1 ? '1px solid #ccc' : 'none',
                                  p: "16px 0"
                              }}>
                                  {header}
                              </Typography>
                        ))}
                    </Box>
                }
                sx={{
                    width: "100%",
                    backgroundColor: "primary.main",
                    color: "common.white",
                    textAlign: "center",
                    p: 0,
                    borderBottom: '1px solid #ccc'
                }}
          />
          <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    p: 0,
                    borderTop: '1px solid #ccc'
                }}
          >
              <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 0'}}>
                  {loading ? (
                        <CircularProgress/>
                  ) : (
                        values.map((value, index) => (
                              <>
                                  {href && hrefIndex === index ?
                                        <Typography key={index} variant="h5" sx={{
                                            flex: 1,
                                            textAlign: 'center',
                                            borderRight: index < values.length - 1 ? '1px solid #ccc' : 'none',
                                            p: "16px 0",
                                            borderBottom: '1px solid #ccc',
                                            color: "#03a9f4",
                                            textDecoration: "underline"
                                        }}>
                                            <Link href={href}>
                                                {value}
                                            </Link>
                                        </Typography>
                                        :
                                        <Typography key={index} variant="h5" sx={{
                                            flex: 1,
                                            textAlign: 'center',
                                            borderRight: index < values.length - 1 ? '1px solid #ccc' : 'none',
                                            p: "16px 0",
                                            borderBottom: '1px solid #ccc'
                                        }}>
                                            {value}
                                        </Typography>
                                  }
                              </>
                        ))
                  )}
              </Box>
              <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                  <Box sx={{maxWidth: '300px'}}>
                      <Pie data={chartData} options={{responsive: true}}/>
                  </Box>
              </Box>
          </CardContent>
      </Card>
);

export default CardComponent;
