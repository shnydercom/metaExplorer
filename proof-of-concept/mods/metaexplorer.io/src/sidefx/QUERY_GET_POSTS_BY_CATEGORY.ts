import { gql } from '@apollo/client'

export const QUERY_GET_POSTS_BY_CATEGORY = gql`
	query getPostsByCategory {
		posts(where: { categoryName: "metaexplorer.io" }) {
			edges {
				node {
					title
					preview {
						node {
							excerpt
							featuredImage {
								node {
									altText
									description(format: RAW)
									srcSet(size: THUMBNAIL)
								}
							}
						}
					}
					slug
				}
			}
		}
	}
`;
